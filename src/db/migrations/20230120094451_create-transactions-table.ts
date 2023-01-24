import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('transactions', (table) =>{
        table.increments('id',{primaryKey: true}).notNullable()
        table.string('reference').notNullable()
        table.integer('wallet_id').unsigned().notNullable()
        table.decimal('amount').notNullable()
        table.decimal('balance_before').notNullable()
        table.decimal('balance_after').notNullable()
        table.enu('purpose', ['deposit', 'withdrawal', 'transfer'])
        table.enu('txn_type', ['credit', 'debit'])
        table.string('description')
        table.json('metadata')
        table.timestamps(true, true)

        table.unique(['reference', 'amount', 'wallet_id'])
        table.foreign('wallet_id').references('id').inTable('wallets')
    } )
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("transactions")
}

