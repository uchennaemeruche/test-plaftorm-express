import { IVirtualAccount, IVirtualAccountCreate, IVirtualAccountResult } from ".."
import { generateTransactionRef, sendRequest } from "../../helpers/utils"

export class MonnifyVirtualAccount implements IVirtualAccount {
    private MONNIFY_BASE_URL = "https://sandbox.monnify.com"
    private partner_banks = ['']
    constructor(private secretKey: string, private appKey: string, private contractCode: string) {
    }

    async reserveVirtualAccount(data: IVirtualAccountCreate): Promise<IVirtualAccountResult> {
        try {
            const reserve_account_url = `${this.MONNIFY_BASE_URL}/api/v2/bank-transfer/reserved-accounts`
            const accountReference = `RESA-${generateTransactionRef()}`
            const payload = {
                accountReference,
                accountName: data.account_name,
                currencyCode: data.currency,
                contractCode: this.contractCode,
                customerEmail: data.email,
                bvn: data.bvn,
                customerName: data.customer_name,
                getAllAvailableBanks: false,
                preferredBanks: this.partner_banks
            }

            const result = await sendRequest({
                secretKey: this.secretKey,
                url: reserve_account_url,
                data: payload
            })
            console.log("RESULT:", result)
            if (result.requestSuccessful && result.responseMessage === 'success' && result.responseBody) {
                const { accountReference, contractCode, accountName, currencyCode, customerName, customerEmail, accounts, ...meta } = result.responseBody
                const data: IVirtualAccountResult = {
                    accountName: accountName,
                    accountNumber: accounts[0].accountNumber,
                    bankName: accounts[0].bankName,
                    bankCode: accounts[0].bankCode,
                    currency: currencyCode,
                    customerEmail: customerEmail,
                    customerName: customerName,
                    accountReference: accountReference,
                    reservationReference: meta.reservationReference,
                    meta
                }
                return data
            }
            throw Error(`Could not generate virtual account number: ${result}`)
        } catch (error) {
            throw error
        }
    }

}
