import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import {
    ISaleInvoiceCreatedPayload,
    ISaleInvoiceDeletePayload,
} from '@/modules/SaleInvoices/SaleInvoice.types';
import { SyncExpenseInvoicedAmountService } from './SyncExpenseInvoicedAmount.service';

@Injectable()
export class SaleInvoiceExpenseSyncSubscriber {
    constructor(
        private readonly syncExpenseInvoiced: SyncExpenseInvoicedAmountService,
    ) { }

    /**
     * Handles incrementing expense invoiced amount once invoice created.
     * @param {ISaleInvoiceCreatedPayload} payload -
     */
    @OnEvent(events.saleInvoice.onCreated)
    public async handleIncrementExpenseInvoicedOnceInvoiceCreated({
        saleInvoice,
        trx,
    }: ISaleInvoiceCreatedPayload) {
        const expenseEntries = (saleInvoice.entries || []).filter(
            (entry) =>
                entry.referenceType === 'Expense' ||
                (entry as any).projectRefType === 'Expense',
        );

        for (const entry of expenseEntries) {
            const expenseId = (entry as any).projectRefId;
            if (!expenseId) continue;

            const amount = entry.amount || entry.quantity * entry.rate;
            await this.syncExpenseInvoiced.incrementExpenseInvoicedAmount(
                expenseId,
                amount,
                trx,
            );
        }
    }

    /**
     * Handles decrementing expense invoiced amount once invoice deleted.
     * @param {ISaleInvoiceDeletePayload} payload -
     */
    @OnEvent(events.saleInvoice.onDeleted)
    public async handleDecrementExpenseInvoicedOnceInvoiceDeleted({
        oldSaleInvoice,
        trx,
    }: ISaleInvoiceDeletePayload) {
        const expenseEntries = (oldSaleInvoice.entries || []).filter(
            (entry) =>
                entry.referenceType === 'Expense' ||
                (entry as any).projectRefType === 'Expense',
        );

        for (const entry of expenseEntries) {
            const expenseId = (entry as any).projectRefId;
            if (!expenseId) continue;

            const amount = entry.amount || entry.quantity * entry.rate;
            await this.syncExpenseInvoiced.decrementExpenseInvoicedAmount(
                expenseId,
                amount,
                trx,
            );
        }
    }
}
