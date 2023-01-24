
import { randomUUID } from "crypto";
import { Knex } from "knex";
import db from "../db/db.knex";
import { AppError, FailedTransactionErr, InsufficientBalanceErr, NotFoundErr } from "../helpers/errors";
import { Wallet } from "../wallet/wallet.service";

export enum TransactionPurpose {
    deposit = 'deposit',
    withdrawal = 'withdrawal',
    transfer = 'transfer',
}
export enum TransactionType {
    credit = "credit",
    debit = "debit"
}

type MetaData = {
    [x: string]: any
}
export interface Transaction {
    id: string;
    reference: string;
    amount: number;
    account_id: number;
    balance_before: number;
    balance_after: number;
    purpose: TransactionPurpose;
    txn_type: TransactionType;
    description: string | null;
    metadata: MetaData;
    createdAt: Date;
    updatedAt: Date;
}

export interface DebitCreditPayload {
    account_id: number
    amount: number
    txn_type?: TransactionType
    purpose: TransactionPurpose
    description?: string
    reference?: string
    metadata?: MetaData
    trx: Knex.Transaction
}

export interface TransactionResponse {
    success: boolean
    error?:  AppError
    message?: string
}

/**
 * @params {string} wallet_id - Account number to credit
 * @params {number} amount - Amount to credit the account number
 * @params {string} description - Description of the txn
 * 
 */
export const creditAccount = async ({ account_id, purpose, amount, txn_type = TransactionType.credit, description, reference = randomUUID(), metadata, trx }: DebitCreditPayload): Promise<TransactionResponse> => {
    try {
        const wallet = await trx<Wallet>('wallets').first().where('id', account_id)
        if (!wallet) throw NotFoundErr(`invalid wallet id`)

        const updateIds = await trx<Wallet>('wallets').where('id', '=', account_id).increment('balance', amount)
        if (!updateIds) {
            // Log to logger
            throw FailedTransactionErr('Could not update account ')
        }

        const inserts = await trx('transactions').insert({
            reference,
            purpose,
            wallet_id: account_id,
            amount,
            balance_before: wallet.balance,
            balance_after: Number(wallet.balance) + amount,
            description,
            txn_type: txn_type,
            metadata,
            
        })
        if (!inserts) throw FailedTransactionErr('Could not add transaction ')

        return {
            success: true,
            message: 'Wallet credited successfully'
        }
    } catch (error: any) {
        return {
            success: false,
            error: error
        }
    }
}
export const debitAccount = async ({ account_id, purpose, amount, txn_type = TransactionType.debit, description, reference = randomUUID(), metadata, trx }: DebitCreditPayload): Promise<TransactionResponse> => {
    try {
        const wallet = await trx<Wallet>('wallets').first().where('id', account_id)
        if (!wallet) throw NotFoundErr('Wallet does not exist')

        if (wallet.balance < amount) throw InsufficientBalanceErr('Transaction')

        const updateIds = await trx<Wallet>('wallets').where('id', '=', account_id).decrement('balance', amount)
        if (!updateIds) throw FailedTransactionErr('Could not complete transaction')

        const inserts = await trx('transactions').insert({
            reference,
            wallet_id:account_id,
            purpose,
            amount,
            balance_before: wallet.balance,
            balance_after: Number(wallet.balance) - amount,
            description,
            metadata,
            txn_type: txn_type
            
        })
        if (!inserts) throw FailedTransactionErr('Could not complete transaction')

        return {
            success: true,
            message: 'Wallet debited successfully'
        }

    } catch (error: any) {
        return {
            success: false,
            error: error
        }
    }
}