export const config = {
  server: {
    port: parseInt(process.env.PORT || '3001'),
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  database: {
    path: process.env.DB_PATH || './src/db.json'
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || '10')
  }
};
