
import { IVirtualAccountCreate, IVirtualAccountResult, IVirtualAccount } from ".."
import { IMemoryCache } from "../../cache"
import { generateTransactionRef, sendRequest } from "../../helpers/utils"

export class FlutterWaveVirtualAccount implements IVirtualAccount{

    private FLUTTERWAVE_URL = 'https://api.flutterwave.com/v3/'

    constructor(private privateKey: string, private cacheSrv: IMemoryCache){}

    async reserveVirtualAccount(data: IVirtualAccountCreate): Promise<IVirtualAccountResult> {
        const reserve_account_url = `${this.FLUTTERWAVE_URL}virtual-account-numbers`
        const accountReference = `FLW-${generateTransactionRef()}`
        const narration = `${data.customer_name.split(" ")[0]} ${data.customer_name.split(" ")[0]}-${accountReference}`
        
        const payload = {
            email:data.email,
            is_permanent: true,
            bvn: data.bvn,
            tx_ref: accountReference,
            phonenumber: data.phone,
            firstname: data.customer_name.split(" ")[0],
            lastname: data.customer_name.split(" ")[1],
            narration
        }

        const result = await sendRequest({
            secretKey: this.privateKey,
            url: reserve_account_url,
            data: payload
        })
        if(result.status !== "success") throw Error("could not generate Virtual Account")
        console.log("RESULT:", result)
        const formattedData: IVirtualAccountResult = {
            accountName: data.account_name,
            accountNumber: result.data.account_number,
            bankName:result.data.bank_name,
            bankCode: result.data.response_code,
            currency: data.currency,
            customerEmail: data.email,
            customerName: data.customer_name,
            accountReference,
            reservationReference: result.data.order_ref,
        }
        return formattedData
    }

    

}