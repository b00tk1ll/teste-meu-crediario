import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../types';
import { AppError } from '../middlewares/errorHandler';
import { config } from '../config';

// Simulação de banco de dados de usuários (em produção, usar banco real)
let users: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    password: '$2a$10$hashedpassword' // senha: admin123
  }
];

export class AuthService {
  /**
   * Hash da senha
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, config.bcrypt.saltRounds);
  }

  /**
   * Verificar senha
   */
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Gerar token JWT
   */
  static generateToken(user: Omit<User, 'password'>): string {
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn as any });
  }

  /**
   * Verificar token JWT
   */
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw new AppError('Token inválido', 401);
    }
  }

  /**
   * Registrar novo usuário
   */
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    // Verificar se usuário já existe
    const existingUser = users.find(u => u.username === userData.username || u.email === userData.email);
    if (existingUser) {
      throw new AppError('Usuário ou email já cadastrado', 409);
    }

    // Hash da senha
    const hashedPassword = await this.hashPassword(userData.password);

    // Criar novo usuário
    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      username: userData.username,
      email: userData.email,
      role: userData.role || 'user',
      password: hashedPassword
    };

    users.push(newUser);

    // Gerar token
    const { password, ...userWithoutPassword } = newUser;
    const token = this.generateToken(userWithoutPassword);

    return {
      user: userWithoutPassword,
      token
    };
  }

  /**
   * Login de usuário
   */
  static async login(loginData: LoginRequest): Promise<AuthResponse> {
    // Buscar usuário
    const user = users.find(u => u.username === loginData.username);
    if (!user) {
      throw new AppError('Credenciais inválidas', 401);
    }

    // Verificar senha
    const isValidPassword = await this.verifyPassword(loginData.password, user.password!);
    if (!isValidPassword) {
      throw new AppError('Credenciais inválidas', 401);
    }

    // Gerar token
    const { password, ...userWithoutPassword } = user;
    const token = this.generateToken(userWithoutPassword);

    return {
      user: userWithoutPassword,
      token
    };
  }

  /**
   * Buscar usuário por ID
   */
  static getUserById(id: number): Omit<User, 'password'> | null {
    const user = users.find(u => u.id === id);
    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Listar todos os usuários (apenas para admin)
   */
  static getAllUsers(): Omit<User, 'password'>[] {
    return users.map(({ password, ...user }) => user);
  }

  /**
   * Inicializar usuários padrão (para desenvolvimento)
   */
  static async initializeDefaultUsers(): Promise<void> {
    if (users.length === 0) {
      const hashedPassword = await this.hashPassword('admin123');
      users.push({
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: 'admin',
        password: hashedPassword
      });
    }
  }
}
