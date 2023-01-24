import { AppError } from "../helpers/errors"

export interface IMemoryCache{
    setWithExpiration(key: any, value: string, ttl?: string | number): Promise<any>
    getValue(key: string): Promise<any>
    deleteValue(key: string): void
    checkForMissAndCache(key: string, hash: string):  Promise<{success: boolean, error?: AppError}>
}
