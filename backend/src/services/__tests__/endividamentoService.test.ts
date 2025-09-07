import { EndividamentoService } from '../endividamentoService';
import { Cliente, Compra, Parcela } from '../../types';

describe('EndividamentoService', () => {
  describe('calcularEndividamentoMaximo', () => {
    it('deve calcular corretamente o endividamento máximo para um cenário simples', () => {
      const cliente: Cliente = {
        id: 1,
        nome: 'Teste',
        cpf: '123.456.789-00',
        email: 'teste@email.com',
        telefone: '11999999999',
        endereco: {
          rua: 'Rua Teste',
          numero: '123',
          bairro: 'Bairro Teste',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567'
        },
        historico_compras: [
          {
            id: 1,
            valor: 500,
            data: '2020-01-10',
            contrato: '0480000000000000199111669920190508',
            parcelas: [
              {
                valorvencimento: 100,
                datavencimento: '2020-02-10',
                dataultimopagamento: '2020-02-10',
                totalpago: 100,
                capitalaberto: 0
              },
              {
                valorvencimento: 100,
                datavencimento: '2020-03-10',
                dataultimopagamento: '2020-03-10',
                totalpago: 100,
                capitalaberto: 0
              },
              {
                valorvencimento: 100,
                datavencimento: '2020-04-10',
                dataultimopagamento: '2020-04-10',
                totalpago: 100,
                capitalaberto: 0
              },
              {
                valorvencimento: 100,
                datavencimento: '2020-05-10',
                dataultimopagamento: '2020-05-10',
                totalpago: 100,
                capitalaberto: 0
              },
              {
                valorvencimento: 100,
                datavencimento: '2020-06-10',
                dataultimopagamento: '2020-06-10',
                totalpago: 100,
                capitalaberto: 0
              }
            ]
          }
        ]
      };

      const resultado = EndividamentoService.calcularEndividamentoMaximo(cliente);
      
      expect(resultado.mes).toBe('01/2020');
      expect(resultado.total).toBe(500);
    });

    it('deve calcular corretamente o endividamento máximo para cenário com múltiplas compras e pagamentos', () => {
      const cliente: Cliente = {
        id: 1,
        nome: 'Teste',
        cpf: '123.456.789-00',
        email: 'teste@email.com',
        telefone: '11999999999',
        endereco: {
          rua: 'Rua Teste',
          numero: '123',
          bairro: 'Bairro Teste',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567'
        },
        historico_compras: [
          {
            id: 1,
            valor: 500,
            data: '2020-01-10',
            contrato: '0480000000000000299111669920190508',
            parcelas: [
              {
                valorvencimento: 100,
                datavencimento: '2020-02-10',
                dataultimopagamento: '2020-02-10',
                totalpago: 100,
                capitalaberto: 0
              },
              {
                valorvencimento: 100,
                datavencimento: '2020-03-10',
                dataultimopagamento: '2020-03-10',
                totalpago: 100,
                capitalaberto: 0
              },
              {
                valorvencimento: 100,
                datavencimento: '2020-04-10',
                dataultimopagamento: '2020-03-10',
                totalpago: 0,
                capitalaberto: 100
              },
              {
                valorvencimento: 100,
                datavencimento: '2020-05-10',
                dataultimopagamento: '2020-05-10',
                totalpago: 0,
                capitalaberto: 100
              },
              {
                valorvencimento: 100,
                datavencimento: '2020-06-10',
                dataultimopagamento: '2020-06-10',
                totalpago: 0,
                capitalaberto: 100
              }
            ]
          },
          {
            id: 2,
            valor: 600,
            data: '2020-04-10',
            contrato: '0480000000000000399111669920190508',
            parcelas: [
              {
                valorvencimento: 300,
                datavencimento: '2020-05-10',
                dataultimopagamento: '2020-05-10',
                totalpago: 200,
                capitalaberto: 100
              },
              {
                valorvencimento: 300,
                datavencimento: '2020-06-10',
                dataultimopagamento: '2020-06-10',
                totalpago: 300,
                capitalaberto: 0
              }
            ]
          }
        ]
      };

      const resultado = EndividamentoService.calcularEndividamentoMaximo(cliente);
      
      expect(resultado.mes).toBe('04/2020');
      expect(resultado.total).toBe(900); // 500 (compra 1) + 600 (compra 2) - 200 (pagamentos até abril)
    });

    it('deve retornar 0 quando não há compras', () => {
      const cliente: Cliente = {
        id: 1,
        nome: 'Teste',
        cpf: '123.456.789-00',
        email: 'teste@email.com',
        telefone: '11999999999',
        endereco: {
          rua: 'Rua Teste',
          numero: '123',
          bairro: 'Bairro Teste',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567'
        },
        historico_compras: []
      };

      const resultado = EndividamentoService.calcularEndividamentoMaximo(cliente);
      
      expect(resultado.mes).toBe('');
      expect(resultado.total).toBe(0);
    });

    it('deve lidar corretamente com datas fora de ordem', () => {
      const cliente: Cliente = {
        id: 1,
        nome: 'Teste',
        cpf: '123.456.789-00',
        email: 'teste@email.com',
        telefone: '11999999999',
        endereco: {
          rua: 'Rua Teste',
          numero: '123',
          bairro: 'Bairro Teste',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01234-567'
        },
        historico_compras: [
          {
            id: 1,
            valor: 500,
            data: '2020-03-10',
            contrato: '0480000000000000499111669920190508',
            parcelas: [
              {
                valorvencimento: 100,
                datavencimento: '2020-04-10',
                dataultimopagamento: '2020-04-10',
                totalpago: 100,
                capitalaberto: 0
              }
            ]
          },
          {
            id: 2,
            valor: 300,
            data: '2020-01-10',
            contrato: '0480000000000000599111669920190508',
            parcelas: [
              {
                valorvencimento: 300,
                datavencimento: '2020-02-10',
                dataultimopagamento: '2020-02-10',
                totalpago: 300,
                capitalaberto: 0
              }
            ]
          }
        ]
      };

      const resultado = EndividamentoService.calcularEndividamentoMaximo(cliente);
      
      expect(resultado.mes).toBe('03/2020');
      expect(resultado.total).toBe(500); // 300 (compra 2) + 500 (compra 1) - 300 (pagamento da compra 2)
    });
  });
});

