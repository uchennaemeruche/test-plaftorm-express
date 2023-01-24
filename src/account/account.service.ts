import { Knex } from "knex";
import { assert, object, optional, string } from "superstruct";
import { IVirtualAccount } from ".";
import { OnboardingError } from "../helpers/errors";
import { User } from "../user/user.service";

export interface Account {
    id: number,
    user_id: number,
    account_number: string,
    account_type: AccountType,
    issuing_bank: string
    is_active?: boolean,
    trx: Knex<Account>,
    metadata?: object
}

export enum AccountType {
    fixed = 'fixed',
    collection = 'collection'
};


export interface IAccountService {
    createAccount(account_type: AccountType, user: User, trx: Knex<Account>, metadata?: any): Promise<Omit<Account, 'trx'>>;
}
export class AccountService implements IAccountService {
    constructor(private virtualAccountProcessor: IVirtualAccount) { }

    async createAccount(account_type: AccountType, user: User, trx: Knex.Transaction, metadata?: any): Promise<Omit<Account, 'trx'> > {
        const schema = object({
            user: object(),
            account_type: string(),
            metadata: optional(object())
        })

        assert({ account_type, user, metadata }, schema)
        // Generate a Virtual Account
        const account = await this.virtualAccountProcessor.reserveVirtualAccount({
            account_type,
            customer_name: `${user.firstname} ${user.lastname}`,
            email: user.email,
            phone: user.phone,
            bvn:user.bvn,
            account_name: `${user.firstname} ${user.lastname}`,
            currency: "NGN"
        })
        if (!account) throw OnboardingError('AccountCreation - Could not generate account number')

        // Save Account Details
        const data = {
            user_id: user.id,
            account_number: account.accountNumber,
            account_type: account_type,
            issuing_bank: account.bankName,
            metadata: account.meta
        }
        const result = await trx('nuban_accounts').insert(data)

        if (!result) throw OnboardingError('AccountCreation - Could not save account details')

        return {
            ...data,
            id: result[0],
            is_active: true
        }

    }

}