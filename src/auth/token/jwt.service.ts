import { ITokenPayload, ITokenService } from "./token.service"
import { JwtPayload, sign, verify } from 'jsonwebtoken'

export class JWTService implements ITokenService {
    constructor(private secretKey: string) {
        this.secretKey = secretKey
    }

    async createToken(payload: string, ttl: number): Promise<string> {
        return await sign({id: payload}, this.secretKey, {expiresIn: ttl})
    }
    // createToken(payload: string, ttl: number): Promise<string> {
    //     return new Promise((resolve, reject) => {
    //         sign({ id: payload }, this.secretKey, { expiresIn: ttl }, (err, token) =>
    //             token ? resolve(token) : reject(err)
    //         )
    //     })
    // }
    async verifyToken(token: string): Promise<ITokenPayload>{
        try {
            const result  = await verify(token, this.secretKey)
            return result as ITokenPayload
        } catch (error: any) {
            return error
        }
        
    }
    // verifyToken(token: string): Promise<ITokenPayload | Error> {
    //     return new Promise((resolve, reject) =>{
    //         return verify(token, this.secretKey, (err, decoded) => {
    //             if(err) reject(err)
    //             resolve(decoded as ITokenPayload)
    //         })
    //     } )
    // }

}