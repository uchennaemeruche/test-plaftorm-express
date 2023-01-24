
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('nuban_accounts', table =>{
        table.string('account_number').primary().unique().notNullable().checkLength('>', 8)
        table.enu('account_type', ['fixed', 'collections'])
        table.string('issuing_bank')
        table.boolean('is_active').defaultTo(true)
        table.json('metadata').nullable()
        table.timestamps(true, true)
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('nuban_accounts')
}

