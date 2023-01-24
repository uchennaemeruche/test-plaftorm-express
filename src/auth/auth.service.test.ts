import { AuthenticationError } from "../helpers/errors";
import { AuthService } from "./auth.service";

describe('Authentication Service', () => {
    let userSrvMock: any;
    let passwordSrvMock: any;
    let tokenSrvMock: any;
    let authService: AuthService;

    beforeEach(() => {
        userSrvMock = {
            findOne: jest.fn(),
            create: jest.fn()
        };

        passwordSrvMock = {
            compare: jest.fn(),
            hash: jest.fn()
        };

        tokenSrvMock = {
            createToken: jest.fn()
        };

        authService = new AuthService(userSrvMock, passwordSrvMock, tokenSrvMock);
    });

    describe('Login', () => {
        const credentials = {
            username: 'test@test.com',
            password: 'password',
        };
        it('should return success and data when login is successful', async () => {
            userSrvMock.findOne.mockResolvedValue({
                uid: '123',
                email: 'test@test.com',
                password: 'hashed_password',
            });
            passwordSrvMock.compare.mockResolvedValue(true);
            tokenSrvMock.createToken.mockResolvedValue('access_token');

            const result = await authService.login(credentials);

            expect(result).toEqual({
                success: true,
                data: {
                    accessToken: 'access_token',
                    id: '123',
                    email: 'test@test.com'
                }
            });
            expect(userSrvMock.findOne).toHaveBeenCalledWith({ email: 'test@test.com' });
            expect(passwordSrvMock.compare).toHaveBeenCalledWith('password', 'hashed_password');
            expect(tokenSrvMock.createToken).toHaveBeenCalledWith('123', 1000);
        });

        it('should throw AuthenticationError when login is not successful', async () => {
            userSrvMock.findOne.mockResolvedValue(null);

            try {
                await authService.login(credentials);
            } catch (error) {
                expect(error).toEqual(AuthenticationError("Incorrect credentials"));
            }
        });

        it('should return serviceResponse when there is an error', async () => {
            userSrvMock.findOne.mockRejectedValue(new Error('Internal Server Error'));

            const result = await authService.login(credentials);
            expect(result).toEqual({
                success: false,
                error: 'Internal Server Error'
            });
        });

        it('should return an error message for invalid inputs', async () => {
            credentials.password = "" // password must be a non-empty string

            const result = await authService.login(credentials);
            expect(result.success).toBe(false)
            expect(result.error).not.toBeNull()
            console.log("RESULT:", result)
            expect(result.error).toHaveProperty('type', 'ValidationError')
            expect(result.error).toHaveProperty('context', 'UserLogin')
            expect(result.error).toHaveProperty('cause')
            expect(result.error).toHaveProperty('message')

        });
    })
    describe('Signup', () => {
        const args = {
            firstname: 'John',
            lastname: 'Doe',
            othernames: "K",
            address: "test address",
            email: 'test@test.com',
            phone: "080321",
            password: 'test_password',
            bvn: ""
        };

        it('should return success and message when signup is successful', async () => {

            userSrvMock.create.mockResolvedValue(1);
            passwordSrvMock.hash.mockResolvedValue('hashed_password');

            const result = await authService.signup(args);

            expect(result).toEqual({
                success: true,
                message: 'New user created',
            });
            expect(passwordSrvMock.hash).toHaveBeenCalledWith(args.password);
            const { password, ...argsWithoutPassword } = args
        });
        it('should return an error message when signup is not successful', async () => {

            userSrvMock.create.mockResolvedValue(null);

            const result = await authService.signup(args);
            expect(result).toEqual({
                success: false,
                error: {
                    context: 'UserSignup',
                    type: 'AuthenticationError'
                }
            });

        });
        it('should return Authentication Error when there is an error', async () => {

            userSrvMock.create.mockRejectedValue(AuthenticationError('Internal Server Error'));

            const result = await authService.signup(args);
            expect(result).toEqual({
                success: false,
                error: {
                    context: "Internal Server Error",
                    type: "AuthenticationError"
                }
            });
        });
        it('should return an error message for invalid inputs', async () => {
            args.password = "" // password must be a non-empty string

            const result = await authService.signup(args);

            expect(result.success).toBe(false)
            expect(result.error).not.toBeNull()
            expect(result.error).toHaveProperty('type', 'ValidationError')
            expect(result.error).toHaveProperty('context', 'UserSignup')
            expect(result.error).toHaveProperty('cause')
            expect(result.error).toHaveProperty('message')

        });
    })
});

