import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('wallets', table =>{
        table.increments('id').primary()
        table.integer('user_id').unsigned().notNullable()
        table.string('account_number').unique().notNullable()
        table.decimal('balance').defaultTo(0)
        table.boolean('is_active').defaultTo(true)
        table.timestamps(true, true)
       
        table.foreign('user_id').references('id').inTable('users')
        table.foreign('account_number').references('account_number').inTable('nuban_accounts')
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('wallets')
}

