
import knex from "knex";
import db from "../db/db.knex";

module.exports = async function createDB(){
    let mydb
    try {
      await db.select(db.raw("current_database()"))
    } catch (error: any) {
        // console.log("ERROR CODE:", error.code)
        // if(error.code != 'ER_BAD_DB_ERROR' || error.errorno != 1049) throw error

        console.log(`Creating database...`)

        await db.raw(`CREATE DATABASE IF NOT EXISTS new_db_created`)

        throw error
    } finally{
        await db?.destroy()
    }
}

if(!module.parent)  module.exports()