import express, { Request, Response } from 'express';
import { readDB, writeDB } from './database';
import { EndividamentoService } from './services/endividamentoService';
import { Cliente, CalculoEndividamentoRequest } from './types';

const router = express.Router();

// List all customers
router.get('/clientes', (req: Request, res: Response) => {
  const db = readDB();
  // Remover historico_compras e endereco de cada cliente antes de retornar
  const clientesSemHistoricoEEndereco = db.clientes.map(cliente => {
    const { historico_compras, endereco, ...resto } = cliente;
    return resto;
  });
  res.json(clientesSemHistoricoEEndereco);
});

// Get a specific customer
router.get('/clientes/:id', (req: Request, res: Response) => {
  const db = readDB();
  const cliente = db.clientes.find(c => c.id === parseInt(req.params.id));
  if (cliente) {
    res.json(cliente);
  } else {
    res.status(404).send('Cliente não encontrado');
  }
});

// Create a new customer
router.post('/clientes', (req: Request, res: Response) => {
  const db = readDB();
  const newCliente: Cliente = {
    id: db.clientes.length > 0 ? Math.max(...db.clientes.map(c => c.id)) + 1 : 1,
    ...req.body
  };
  db.clientes.push(newCliente);
  writeDB(db);
  res.status(201).json(newCliente);
});

// Update a customer
router.put('/clientes/:id', (req: Request, res: Response) => {
    const db = readDB();
    const clienteIndex = db.clientes.findIndex(c => c.id === parseInt(req.params.id));
    if (clienteIndex !== -1) {
        db.clientes[clienteIndex] = { ...db.clientes[clienteIndex], ...req.body };
        writeDB(db);
        res.json(db.clientes[clienteIndex]);
    } else {
        res.status(404).send('Cliente não encontrado');
    }
});

// Delete a customer
router.delete('/clientes/:id', (req: Request, res: Response) => {
    const db = readDB();
    const clienteIndex = db.clientes.findIndex(c => c.id === parseInt(req.params.id));
    if (clienteIndex !== -1) {
        const deletedCliente = db.clientes.splice(clienteIndex, 1);
        writeDB(db);
        res.json(deletedCliente);
    } else {
        res.status(404).send('Cliente não encontrado');
    }
});

// Get a customer's purchase history
router.get('/clientes/:id/compras', (req: Request, res: Response) => {
    const db = readDB();
    const cliente = db.clientes.find(c => c.id === parseInt(req.params.id));
    if (cliente) {
        res.json(cliente.historico_compras);
    } else {
        res.status(404).send('Cliente não encontrado');
    }
});

// Add a new purchase to a customer
router.post('/clientes/:id/compras', (req: Request, res: Response) => {
    const db = readDB();
    const clienteIndex = db.clientes.findIndex(c => c.id === parseInt(req.params.id));
    if (clienteIndex !== -1) {
        const newCompra = {
            id: db.clientes[clienteIndex].historico_compras.length > 0 ? Math.max(...db.clientes[clienteIndex].historico_compras.map(c => c.id)) + 1 : 1,
            ...req.body
        };
        db.clientes[clienteIndex].historico_compras.push(newCompra);
        writeDB(db);
        res.status(201).json(newCompra);
    } else {
        res.status(404).send('Cliente não encontrado');
    }
});

// Calcular endividamento máximo de um cliente
router.post('/endividamento/calcular', (req: Request<{}, {}, CalculoEndividamentoRequest>, res: Response) => {
  try {
    const { cliente } = req.body;
    
    if (!cliente || !cliente.historico_compras) {
      return res.status(400).json({ 
        error: 'Dados do cliente são obrigatórios e devem incluir histórico de compras' 
      });
    }

    const resultado = EndividamentoService.calcularEndividamentoMaximo(cliente);
    res.json(resultado);
  } catch (error) {
    console.error('Erro ao calcular endividamento:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor ao calcular endividamento' 
    });
  }
});

export default router;

