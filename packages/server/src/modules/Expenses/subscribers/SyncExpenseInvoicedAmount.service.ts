import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { Expense } from '../models/Expense.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';

@Injectable()
export class SyncExpenseInvoicedAmountService {
    /**
     * @param {TenantModelProxy<typeof Expense>} expenseModel - The expense model.
     */
    constructor(
        @Inject(Expense.name)
        private readonly expenseModel: TenantModelProxy<typeof Expense>,
    ) { }

    /**
     * Increment expense invoiced amount.
     * @param {number} expenseId - Expense id.
     * @param {number} amount - Amount to increment.
     * @param {Knex.Transaction} trx - Knex transaction.
     */
    public incrementExpenseInvoicedAmount = async (
        expenseId: number,
        amount: number,
        trx?: Knex.Transaction,
    ) => {
        await this.expenseModel()
            .query(trx)
            .findById(expenseId)
            .increment('invoicedAmount', amount);
    };

    /**
     * Decrement expense invoiced amount.
     * @param {number} expenseId - Expense id.
     * @param {number} amount - Amount to decrement.
     * @param {Knex.Transaction} trx - Knex transaction.
     */
    public decrementExpenseInvoicedAmount = async (
        expenseId: number,
        amount: number,
        trx?: Knex.Transaction,
    ) => {
        await this.expenseModel()
            .query(trx)
            .findById(expenseId)
            .decrement('invoicedAmount', amount);
    };
}
