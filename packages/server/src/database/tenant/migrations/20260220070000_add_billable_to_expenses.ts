/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable('expenses_transactions', (table) => {
        table.boolean('billable').defaultTo(false).after('branch_id');
        table.integer('customer_id').unsigned().nullable().after('billable');

        table
            .foreign('customer_id')
            .references('id')
            .inTable('contacts')
            .onDelete('SET NULL');

        table.index(['billable', 'customer_id'], 'idx_expenses_billable_customer');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable('expenses_transactions', (table) => {
        table.dropIndex(
            ['billable', 'customer_id'],
            'idx_expenses_billable_customer',
        );
        table.dropForeign('customer_id');
        table.dropColumn('customer_id');
        table.dropColumn('billable');
    });
};
