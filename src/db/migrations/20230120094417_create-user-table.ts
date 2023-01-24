import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {

    // const dbCreate = await knex.raw(`CREATE DATABASE [IF NOT EXISTS] lendsqr-demo-wallet `)


    return knex.schema.createTable("users", (table: Knex.TableBuilder) =>{
        table.increments('id',{primaryKey: true})
        table.uuid('uid').notNullable().unique()
        table.string('firstname').notNullable()
        table.string('lastname').notNullable()
        table.string('othernames').notNullable()
        table.string('address')
        table.string('phone').notNullable()
        table.string('email').unique().notNullable()
        table.string('password').notNullable()
        table.string('bvn').notNullable()
        table.timestamps(true, true)
    })
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists("users") 
}

