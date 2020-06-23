import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface CreateTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: CreateTransaction): Transaction {
    const transactions = this.transactionsRepository.all();

    if (transactions.length === 0 && type === 'outcome') {
      throw Error('Income value is less than the outcome');
    }

    if (transactions.length > 0 && type === 'outcome') {
      const balance = this.transactionsRepository.getBalance();

      const result = balance.income - balance.outcome;

      if (value > result) {
        throw Error('Income value is less than the outcome');
      }
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
