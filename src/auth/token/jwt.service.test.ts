import { sign, verify } from "jsonwebtoken";
import { JWTService } from "./jwt.service";

jest.setTimeout(10000)
jest.mock('jsonwebtoken', () => {
    return {
        sign: jest.fn((payload: any, secret: string, options: any, callback: any) => {
            return 'mocked_token';
        }),
        verify: jest.fn((token: string, secret: string, options: any, callback: any) => {
            if(token) {
                return {
                    id: 'mocked_payload'
                };
            }
            throw new Error('Invalid token');
        })
    };
});
describe('JWTService', () => { 
    let jwtService: JWTService;
    const SECRET_KEY = 'secret_keyjfseowe';
    const PAYLOAD = 'payload';
    const TTL = 3600;
    const TOKEN = 'token';

    beforeEach(() => {
        jwtService = new JWTService(SECRET_KEY);
    });

    describe('createToken', () => {
        it('should create a token with the given payload and ttl', async () => {
            const createdToken = await jwtService.createToken(PAYLOAD, TTL);
            expect(createdToken).toEqual('mocked_token');
            expect(sign).toHaveBeenCalledWith({ id: PAYLOAD }, SECRET_KEY, { expiresIn: TTL });
        });
    });

    describe('verifyToken', () => {
        it('should return the decoded payload if the token is valid', async () => {
            const decodedPayload = { id: "mocked_payload" };
            const payload = await jwtService.verifyToken(TOKEN);
            expect(payload).toEqual(decodedPayload);
            expect(verify).toHaveBeenCalledWith(TOKEN, SECRET_KEY);
        });
    
        it('should return an error if the token is invalid', async () => {
            const error = new Error('Invalid token');
            const invalidToken = 'invalid_token';
            try {
                await jwtService.verifyToken(invalidToken);
            } catch (err:any) {
                expect(err).toEqual(error);
                expect(verify).toHaveBeenCalledWith(TOKEN, SECRET_KEY);
            }
        });
    });

 })