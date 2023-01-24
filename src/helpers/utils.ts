import { createHmac, randomUUID } from "crypto"
import axios from "axios"

export const generateTransactionRef = () => {
    return randomUUID()
}

export const sendRequest = async ({ secretKey, url, method = "post", data }: { secretKey: string, url: string, method?: string, data?: object }) => {
    try {
        const result = await axios({ method, url, data, headers: { Authorization: secretKey } })
        return result.data
    } catch (error) {
        console.log("Axios Request ERROR ", error)
        throw error
    }
}

export const hashArguments = <P extends unknown[]>(args: P) => {
    const hash = createHmac('sha512', "securedhashkey");
    hash.update(args.join(''));
    return hash.digest('hex');
}