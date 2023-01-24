import  knex from "knex";
import { ConfigService } from "../config";
import configs from "./knexfile"

const dbconfig = new ConfigService()

const config = configs[dbconfig.get('NODE_ENV')]

const db = knex(config)

export default db