
import { IVirtualAccount } from "../account";
import { AccountService } from "../account/account.service";
import { FakeProcessor } from "../account/processors/fake.processor";
import { AuthRouteHandler } from "../auth/auth.route";
import { AuthService } from "../auth/auth.service";
import { PasswordService } from "../auth/password.service";
import { JWTService } from "../auth/token/jwt.service";
import { ITokenService } from "../auth/token/token.service";
import { IMemoryCache } from "../cache";
import { LocalNodeCache } from "../cache/node.cache";
import { ConfigService } from "../config";
import db from "../db/db.knex";
import { OnboardingRouteHandler } from "../onboarding/onbaording.handler";
import { OnboardingService } from "../onboarding/onboarding.service";
import { TransactionRouteHandler } from "../transaction/transaction.handler";
import { TransactionService } from "../transaction/transaction.service";
import { UserService } from "../user/user.service";
import { WalletService } from "../wallet/wallet.service";
import { AppServer } from "./app";

const configSrv = new ConfigService()
const tokenSrv:ITokenService = new JWTService(configSrv.get('TOKEN_SECRET'))
const userSrv = new UserService(db)
const passwordSrv = new PasswordService(configSrv)
const authSrv = new AuthService(userSrv, passwordSrv, tokenSrv)
const walletSrv =  new WalletService(db)
const virutalAccountProcessor: IVirtualAccount = new FakeProcessor()
const accountSrv = new AccountService(virutalAccountProcessor)
const cacheSrv:IMemoryCache = new LocalNodeCache()
const transactionSrv = new TransactionService(cacheSrv, db)

const onboardingSrv = new OnboardingService(userSrv, passwordSrv, walletSrv, accountSrv, db)


const routeHandlers =[
    new OnboardingRouteHandler(onboardingSrv),
    new AuthRouteHandler(authSrv),
    new TransactionRouteHandler(transactionSrv)
]
new AppServer(routeHandlers).startServer(configSrv.get('APP_PORT'))