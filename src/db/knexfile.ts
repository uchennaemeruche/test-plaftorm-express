import type { Knex } from "knex";
import { ConfigService } from "../config";

const dbconfig = new ConfigService()

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "mysql2",
    connection: {
      database: dbconfig.get("DB_NAME"),
      user: dbconfig.get("DB_USER"),
      password: dbconfig.get("DB_PASSWORD"),
      host: dbconfig.get("HOST"),
      port: dbconfig.get("DB_PORT")
    },
    debug: true,
    
  },

  staging: {
   
  },

  production: {
   
    migrations: {
      tableName: "knex_migrations"
    }
  }

};

export default config;
