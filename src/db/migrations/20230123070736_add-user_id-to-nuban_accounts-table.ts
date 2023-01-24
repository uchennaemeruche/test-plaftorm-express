import e from "express";
import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return await knex.schema.alterTable('nuban_accounts', table =>{
        table.integer('user_id').notNullable().after('issuing_bank')
    })
}


export async function down(knex: Knex): Promise<void> {
}

