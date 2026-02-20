import { Inject, Injectable } from '@nestjs/common';
import { Expense } from '../models/Expense.model';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { IBillableExpensesFilter } from '../Expenses.types';

@Injectable()
export class GetBillableExpensesService {
    constructor(
        @Inject(Expense.name)
        private readonly expenseModel: TenantModelProxy<typeof Expense>,
    ) { }

    /**
     * Retrieve billable (un-invoiced) expenses list.
     * @param {IBillableExpensesFilter} filter
     * @return {Promise<Expense[]>}
     */
    public async getBillableExpenses(
        filter: IBillableExpensesFilter,
    ): Promise<Expense[]> {
        const query = this.expenseModel()
            .query()
            .modify('billable')
            .withGraphFetched('categories')
            .withGraphFetched('customer')
            .orderBy('paymentDate', 'DESC');

        if (filter.customerId) {
            query.modify('filterByCustomerId', filter.customerId);
        }

        return query;
    }
}
