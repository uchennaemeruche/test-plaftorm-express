import { IVirtualAccount, IVirtualAccountCreate, IVirtualAccountResult } from "..";
import { generateTransactionRef } from "../../helpers/utils";
import { AccountType } from "../account.service";

export class FakeProcessor implements IVirtualAccount{
    async reserveVirtualAccount(data: IVirtualAccountCreate): Promise<IVirtualAccountResult> {
        try {
            const prefix = data.account_type === AccountType.fixed ? "31" : "30"
            const time = new Date().getTime()
            let counter = 0
            let account_number =  prefix + (`${Math.floor(Math.random() * 10000)}` + time + ("0000" + counter).slice(-4)).substring(0, 8)
            
            // Check if the generated account number exist in DB and retry

            const result: IVirtualAccountResult =  {
                accountName: data.account_name,
                accountNumber: account_number,
                bankName:"Polaris Bank",
                bankCode: "023",
                currency: data.currency,
                customerEmail: data.email,
                customerName: data.customer_name,
                accountReference: `FAKE-${generateTransactionRef()}`,
                reservationReference: generateTransactionRef(),
            }
            return result
        } catch (error) {
            throw new Error('Could not generate account number at this time')
        }
    }

}