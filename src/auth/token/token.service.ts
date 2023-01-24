export interface ITokenPayload {
    id: string;
    issuedAt: number
    expiredAt: number
}

export interface ITokenService {
    createToken: (payload: string, duration: number) => Promise<string>;
    verifyToken: (token: string) => Promise<ITokenPayload | string>
}

