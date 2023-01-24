
import { randomUUID } from "crypto";
import { assert, nonempty, object, omit, string } from "superstruct";
import { AuthenticationError, DuplicateErr } from "../helpers/errors";
import { formatErrorMessages } from "../helpers/response";
import { User, UserCreatePayload, UserService } from "../user/user.service";
import { PasswordService } from "./password.service";
import { ITokenService } from "./token/token.service";

export type Credentials = {
    username: string
    password: string
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
    data?: UserInfo
}

export class AuthService {
    constructor(private readonly userSrv: UserService, private readonly passwordSrv: PasswordService, private tokenSrv: ITokenService) { }

    async login(credentials: Credentials): Promise<ServiceResponse> {
       try {
        const { username, password } = credentials
        const schema = object({
            username: nonempty(string()),
            password: nonempty(string()),
        })
        assert({ username, password }, schema)

        const user = await this.userSrv.findOne({ email: username })

        if (!user || !(await this.passwordSrv.compare(password, user.password))) {
            throw AuthenticationError("Incorrect credentials");
        }
        const accessToken = await this.tokenSrv.createToken(user.uid, 1000)
        return {
            success: true,
            data: {
                accessToken,
                id: user.uid,
                email: user.email
            }
        }
       } catch (error: any) {
        return formatErrorMessages(error, "UserLogin")
       }
    }

    async signup(args: UserCreatePayload): Promise<ServiceResponse> {
        try {
            assert(args, omit(User, ['id', 'uid']))
            const { password, ...dataWithoutPassword } = args as UserCreatePayload
            const uid = randomUUID()

            const useExist = await this.userSrv.findOne({email: args.email})
            if(useExist) throw DuplicateErr('UserSignup - Email is already in use' )

            const insertIds = await this.userSrv.create({ args: {uid, password: await this.passwordSrv.hash(password), ...dataWithoutPassword} })
            if (!insertIds) throw AuthenticationError('UserSignup')
            return {
                success: true,
                message: "New user created"
            }
        } catch (error: any) {
            return formatErrorMessages(error, "UserSignup")
        }
    }
}