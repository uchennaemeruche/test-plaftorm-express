import { AccountType } from "./account.service"

export interface IVirtualAccountCreate {
    bvn: string
    account_name: string
    currency: string
    email: string
    customer_name: string
    phone?: string
    account_type: AccountType
}

export interface IVirtualAccountResult {
    accountName: string
    accountNumber: string
    bankName: string
    bankCode: string
    currency: string
    customerEmail: string
    customerName: string
    accountReference: string
    reservationReference: string
    meta?: {
        [key: string]: any
    }
}
export interface IVirtualAccount {
    reserveVirtualAccount(data: IVirtualAccountCreate): Promise<IVirtualAccountResult>
}