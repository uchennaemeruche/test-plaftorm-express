import { Knex } from "knex";
import { OnboardingError } from "../helpers/errors";
import { User } from "../user/user.service";


export interface Wallet {
    id: number
    user_id: number
    account_number: string
    balance: number
    is_active: boolean
    email: string
    firstname: string
    lastname: string
    phone: string
    user_uid: string
    bvn: string
}
export interface IWalletService {
    createWallet(user_id: number, account_number: string, trx: Knex<Wallet>): Promise<number>
    findOne(wallet_id: number): Promise<Wallet | undefined>
}

export class WalletService implements IWalletService {
    constructor(private db: Knex<Wallet>) { }

    async createWallet(user_id: number, account_number: string, trx: Knex<Wallet>): Promise<number> {
        const wallet_id = await trx('wallets').insert({ account_number, user_id })
        if(!wallet_id){
           throw OnboardingError('WalletCreation - could not create a wallet')
        }
       return wallet_id[0]
    }

    async findOne(wallet_id: number): Promise<Wallet | undefined> {
        console.log("WALLET ID:", wallet_id)
        const wallet = await this.db('wallets')
        .select('wallets.id', 'wallets.balance', 'wallets.is_active', 'wallets.user_id', 'email', 'phone', 'uid as user_uid', 'firstname', 'lastname', 'bvn')
            .join<User>('users', { 'users.id': 'wallets.user_id' })
            .where('wallets.id', wallet_id).first() 

            return wallet
    }

}