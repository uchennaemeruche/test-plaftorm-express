
import { randomUUID } from "crypto";
import { Knex } from "knex";
import { assert,omit } from "superstruct";
import { AccountService, AccountType } from "../account/account.service";
import { PasswordService } from "../auth/password.service";
import { DuplicateErr } from "../helpers/errors";
import { formatErrorMessages } from "../helpers/response";
import { User, UserCreatePayload, UserService } from "../user/user.service";
import { WalletService } from "../wallet/wallet.service";

export type Credentials = {
    username: string
    password: string
}

type UserData = {
    [key:string]: any
}


type UserInfo = {
    id: string;
    email: string;
    accessToken?: string;
}

interface ServiceResponse {
    success: boolean
    error?: string
    message?: string
    data?: UserInfo | UserData
}

export class OnboardingService {
    constructor(private readonly userSrv: UserService, private readonly passwordSrv: PasswordService, private readonly walletSrv: WalletService, private readonly accountSrv: AccountService, private dbSrv: Knex<any>) { }

    // Create a transaction
    // Create a new user
    // genreate an account number
    // create a user wallet
    async register(args: UserCreatePayload): Promise<ServiceResponse> {
        const trx = await this.dbSrv.transaction()
        try {
            assert(args, omit(User, ['id', 'uid']))
            const { password, ...dataWithoutPassword } = args as UserCreatePayload
            const uid = randomUUID()

            const userExist = await this.userSrv.findOne({email: args.email})
            if(userExist) throw DuplicateErr('UserSignup - Email is already in use')

            const hashedPassword = await this.passwordSrv.hash(password)

            const userId = await this.userSrv.create({
                trx,
                args: {
                    uid,
                    password: hashedPassword,
                    ...dataWithoutPassword
                }
                })
            console.log("USER ID:", userId)
            const user = {uid, id: userId, password: hashedPassword, ...dataWithoutPassword}

            const account =  await this.accountSrv.createAccount(AccountType.fixed, user, trx )

            const walletId = await this.walletSrv.createWallet(userId, account.account_number, trx)

            trx.commit()
            return {
                success: true,
                data: {
                    account_number: account.account_number,
                    issuing_bank: account.issuing_bank,
                    wallet_id: walletId,
                    account_type: account.account_type,
                },
                message: "User onboarded successfully"
            }
        } catch (error: any) {
            trx.rollback()
            return formatErrorMessages(error, "UserSignup")
        }
    }
}