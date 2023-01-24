import { Knex } from "knex";
import { assert, Infer, number, object, optional, string } from "superstruct";
import { IMemoryCache } from "../cache";
import { formatErrorMessages } from "../helpers/response";
import { generateTransactionRef, hashArguments } from "../helpers/utils";
import { creditAccount, debitAccount, TransactionPurpose, TransactionResponse } from "./transaction.helper";

export interface ServiceResponse {
    success: boolean
    error?: string
    message?: string
}

export interface ITransactionService {
    transfer(amount: number, to_account: number, from_account: number, description?: string): Promise<ServiceResponse>
    deposit(payload: ITransactionPayload): Promise<ServiceResponse>
    withdraw(payload: ITransactionPayload): Promise<ServiceResponse>
    reverse(reference: string): Promise<ServiceResponse>
}

const DepositWithrawalSchema = object({
    account_id: number(),
    amount: number(),
    description: optional(string())
})

export type ITransactionPayload = Infer<typeof DepositWithrawalSchema>

export class TransactionService implements ITransactionService {
    constructor(private cacheSrv: IMemoryCache, private db: Knex) { }

    async transfer(amount: number, to_account: number, from_account: number, description?: string | undefined): Promise<ServiceResponse> {
       try {
        const schema = object({
            amount: number(),
            from_account: number(),
            to_account: number(),
            description: optional(string())
        })
        assert({ amount, to_account, from_account, description }, schema)

        // Check for duplicate transaction
        const hashedRequest = hashArguments([amount, to_account, from_account])
        const cacheResult = await this.cacheSrv.checkForMissAndCache(from_account.toString(), hashedRequest)
        if (!cacheResult.success) return formatErrorMessages(cacheResult)

        const trx = await this.db.transaction()
        try {
            const reference = generateTransactionRef()
            const purpose = TransactionPurpose.transfer

            const transferResult = await Promise.all([
                debitAccount({
                    account_id: from_account,
                    amount,
                    purpose,
                    reference,
                    metadata: {
                        'recipient_id': to_account
                    },
                    trx
                }),
                creditAccount({
                    account_id: to_account,
                    amount,
                    purpose,
                    reference,
                    metadata: {
                        'sender_id': from_account
                    },
                    trx
                })
            ])

            const failedTxns = transferResult.filter((result) => !result.success);
            if (failedTxns.length) {
                await trx.rollback();
                return formatErrorMessages(failedTxns)
            }

            await trx.commit()
            return {
                success: true,
                message: "Transfer processed successfully"
            };
        } catch (error:any) {
            await trx.rollback();
            return formatErrorMessages(error)
        }
       } catch (error:any) {
        return formatErrorMessages(error)
       }
    }

    async deposit(payload: ITransactionPayload): Promise<ServiceResponse> {

        try {
            assert({ ...payload }, DepositWithrawalSchema)

            const trx = await this.db.transaction()
            try {
                const result = await creditAccount({
                    ...payload,
                    purpose: TransactionPurpose.deposit,
                    trx
                })
    
                if (!result.success) {
                    await trx.rollback();
                    return formatErrorMessages(result);
                }
    
                await trx.commit();
                return {
                    success: result.success,
                    message: result.message
                }
            } catch (error: any) {
                await trx.rollback();
                return formatErrorMessages(error)
            }
        } catch (error: any) {
            return formatErrorMessages(error)

        }
    }
    async withdraw(paylaod: ITransactionPayload): Promise<ServiceResponse> {
        try {
            assert({ ...paylaod}, DepositWithrawalSchema)

        const trx = await this.db.transaction()

        try {
            const result = await debitAccount({
              ...paylaod,
                purpose: TransactionPurpose.withdrawal,
                trx
            })
            if (!result.success) {
                await trx.rollback();
                return formatErrorMessages(result);
            }

            await trx.commit();
            return {
                success: result.success,
                message: result.message
            }
        } catch (error:any) {
            await trx.rollback();
            return formatErrorMessages(error)
        }
        } catch (error:any) {
            return formatErrorMessages(error)
        }
    }

    reverse(reference: string): Promise<ServiceResponse> {
        throw new Error("Method not implemented.");
    }

    

    isTransactionResponse(response: TransactionResponse | TransactionResponse[]){
      return "success" in response
    }

}