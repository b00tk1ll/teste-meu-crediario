import { Cliente, EndividamentoResult } from '../types';

export class EndividamentoService {
  /**
   * Calcula o mês com maior endividamento em aberto para um cliente
   * @param cliente - Cliente para calcular o endividamento
   * @returns Objeto com o mês e valor total do maior endividamento
   */
  static calcularEndividamentoMaximo(cliente: Cliente): EndividamentoResult {
    const eventos: Array<{ data: Date; valor: number; tipo: 'compra' | 'pagamento' }> = [];

    // Processar todas as compras e pagamentos
    cliente.historico_compras.forEach(compra => {
      const dataCompra = new Date(compra.data);
      eventos.push({
        data: dataCompra,
        valor: compra.valor,
        tipo: 'compra'
      });

      // Processar pagamentos das parcelas
      compra.parcelas.forEach(parcela => {
        if (parcela.totalpago > 0) {
          const dataPagamento = new Date(parcela.dataultimopagamento);
          eventos.push({
            data: dataPagamento,
            valor: -parcela.totalpago, // Negativo para pagamentos
            tipo: 'pagamento'
          });
        }
      });
    });

    // Ordenar eventos por data
    eventos.sort((a, b) => a.data.getTime() - b.data.getTime());

    let saldoAtual = 0;
    let maxEndividamento = 0;
    let mesMaxEndividamento = '';

    // Calcular saldo mês a mês
    const saldosPorMes = new Map<string, number>();

    eventos.forEach(evento => {
      saldoAtual += evento.valor;
      
      // Agrupar por mês/ano
      const mesAno = `${(evento.data.getMonth() + 1).toString().padStart(2, '0')}/${evento.data.getFullYear()}`;
      
      if (!saldosPorMes.has(mesAno)) {
        saldosPorMes.set(mesAno, 0);
      }
      
      saldosPorMes.set(mesAno, saldoAtual);
      
      // Atualizar máximo se necessário
      if (saldoAtual > maxEndividamento) {
        maxEndividamento = saldoAtual;
        mesMaxEndividamento = mesAno;
      }
    });

    return {
      mes: mesMaxEndividamento,
      total: Math.round(maxEndividamento * 100) / 100 // Arredondar para 2 casas decimais
    };
  }
}

