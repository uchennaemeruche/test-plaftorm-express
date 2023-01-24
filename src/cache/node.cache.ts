

import Node_Cache from "node-cache"
import * as dotenv from "dotenv"
import { IMemoryCache } from "./index"
import { DuplicateErr, OtherErrs } from "../helpers/errors"
dotenv.config()

export class LocalNodeCache implements IMemoryCache {

    client: Node_Cache
    constructor() {
        this.client = new Node_Cache()
    }
    async setWithExpiration(key: any, value: string, ttl?: string) {
        if (ttl) return this.client.set(key, value, ttl)
        return this.client.set(key, value)
    }
    async getValue(key: string): Promise<any> {
        return await this.client.get(key)
    }
    deleteValue(key: string): any {
        return this.client.del(key);
    }

    async checkForMissAndCache(key: string, value: string) {
        const savedHash = await this.getValue(key)
        if (savedHash) {
            return {
                success: false,
                error: DuplicateErr('Transaction Cache',),
            };
        }
        const response = await this.setWithExpiration(key, value, '60');
        if (!response) {
            return { success: response, error: OtherErrs('Transaction Cache', new Error('Something went wrong')) };
        }
        return { success: response, };
    }

}




