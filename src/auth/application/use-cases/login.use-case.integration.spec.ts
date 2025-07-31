import { TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { LoginDto } from '../dto/login.dto';
import { AuthErrors } from '../../domain/errors/auth.errors';
import { setUpAuthTestingModule, tearDownAuthTestingModule } from '../../testing/configure-auth-module';
import { HASHING_SERVICE } from '../interfaces';
import { UserDocument } from '../../../users/infrastructure/schemas/user.schema';
import { LoginUseCase } from './login.use-case';

describe('Login Use Case', () => { 
    let testModule: TestingModule;
    let loginUseCase: LoginUseCase;

    beforeAll(async () => {
        testModule = await setUpAuthTestingModule();
        await createUserTestData(testModule);
        loginUseCase = testModule.get(LoginUseCase);
    });

    afterAll(async () => {
        await tearDownAuthTestingModule();
    });

    it('should be defined', () => {
        expect(loginUseCase).toBeDefined();
    });

    it('should execute login successfully', async () => {
        const userDtoTest: LoginDto = {
            email: 'test@example.com',
            password: 'password123',
        };
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';
        const ipAddress = '127.0.0.1';

        const resultSuccess = await loginUseCase.execute(userDtoTest, userAgent, ipAddress);
        
        // Test successful login
        expect(resultSuccess.isSuccess).toBe(true);
        expect(resultSuccess.isFailure).toBe(false);
        expect(resultSuccess.error).toBeUndefined();
        expect(resultSuccess.value!.user).toEqual({
            id: expect.any(String),
            name: 'Test User',
            email: 'test@example.com',
            status: 'active'
        });
        expect(resultSuccess.value!.accessToken).toEqual(expect.any(String));
        expect(resultSuccess.value!.refreshToken).toEqual(expect.any(String));
    });

    it('should fail login with invalid credentials', async () => {
        // Test failed login when user is not found
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';
        const ipAddress = '127.0.0.1';
        
        const userDtoTest: LoginDto = {
            email: 'invalid@example.com',
            password: 'wrongpassword',
        };
        const resultFailureWhenUserNotFound = await loginUseCase.execute(userDtoTest, userAgent, ipAddress);

        expect(resultFailureWhenUserNotFound.isSuccess).toBe(false);
        expect(resultFailureWhenUserNotFound.isFailure).toBe(true);
        expect(resultFailureWhenUserNotFound.error).toBeDefined();
        expect(resultFailureWhenUserNotFound.error).toStrictEqual(AuthErrors.INVALID_CREDENTIALS);
        expect(resultFailureWhenUserNotFound.value).toBeUndefined();

        // Test failed login when password is incorrect
        const userDtoTestInvalidPassword: LoginDto = {
            email: 'test@example.com',
            password: 'wrongpassword',
        };

        const resultFailureWhenPasswordIncorrect = await loginUseCase.execute(userDtoTestInvalidPassword, userAgent, ipAddress);

        expect(resultFailureWhenPasswordIncorrect.isSuccess).toBe(false);
        expect(resultFailureWhenPasswordIncorrect.isFailure).toBe(true);
        expect(resultFailureWhenPasswordIncorrect.error).toBeDefined();
        expect(resultFailureWhenPasswordIncorrect.error).toStrictEqual(AuthErrors.INVALID_CREDENTIALS);
        expect(resultFailureWhenPasswordIncorrect.value).toBeUndefined();
    });

    it('should fail login for pending user', async () => {
        const userDtoTest: LoginDto = {
            email: 'pending@example.com',
            password: 'password123',
        };
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';
        const ipAddress = '127.0.0.1';

        const resultFailureWhenUserPending = await loginUseCase.execute(userDtoTest, userAgent, ipAddress);

        expect(resultFailureWhenUserPending.isSuccess).toBe(false);
        expect(resultFailureWhenUserPending.error).toBeDefined();
        expect(resultFailureWhenUserPending.error).toStrictEqual(AuthErrors.EMAIL_NOT_VERIFIED);
        expect(resultFailureWhenUserPending.value).toBeUndefined();
    });

    it('should fail login for blocked user', async () => {
        const userDtoTest: LoginDto = {
            email: 'blocked@example.com',
            password: 'password123',
        };
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';
        const ipAddress = '127.0.0.1';

        const resultFailureWhenUserBlocked = await loginUseCase.execute(userDtoTest, userAgent, ipAddress);

        expect(resultFailureWhenUserBlocked.isSuccess).toBe(false);
        expect(resultFailureWhenUserBlocked.error).toBeDefined();
        expect(resultFailureWhenUserBlocked.error).toStrictEqual(AuthErrors.ACCOUNT_BLOCKED);
        expect(resultFailureWhenUserBlocked.value).toBeUndefined();
    });

    it('should fail login for user with too many failed attempts', async () => {
        const userDtoTest: LoginDto = {
            email: 'failed@example.com',
            password: 'password123',
        };

        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';
        const ipAddress = '127.0.0.1';

        const resultFailureWhenUserFailedAttempts = await loginUseCase.execute(userDtoTest, userAgent, ipAddress);

        expect(resultFailureWhenUserFailedAttempts.isSuccess).toBe(false);
        expect(resultFailureWhenUserFailedAttempts.error).toBeDefined();
        expect(resultFailureWhenUserFailedAttempts.error).toStrictEqual(AuthErrors.ACCOUNT_LOCKED);
        expect(resultFailureWhenUserFailedAttempts.value).toBeUndefined();
    });

});

const createUserTestData = async (testModule: TestingModule) => {
    const hashingService = testModule.get(HASHING_SERVICE);
    const userModel: Model<UserDocument> = testModule.get<Model<UserDocument>>(getModelToken(UserDocument.name));
    const passwordHash = await hashingService.hash('password123');
    // Create a test user with correct data
    await userModel.create({
        name: 'Test User',
        email: 'test@example.com',
        password: passwordHash,
        timezone: 'UTC',
        status: 'active',
        accountType: 'free'
    });
    // Create a pending user
    await userModel.create({
        name: 'Pending User',
        email: 'pending@example.com',
        password: passwordHash,
        timezone: 'UTC',
        status: 'pending',
        accountType: 'free'
    });
    // Create a blocked user
    await userModel.create({
        name: 'Blocked User',
        email: 'blocked@example.com',
        password: passwordHash,
        timezone: 'UTC',
        status: 'blocked',
        accountType: 'free'
    });
    // Create a user with a lot of failed login attempts
    await userModel.create({
        name: 'Failed Login User',
        email: 'failed@example.com',
        password: passwordHash,
        timezone: 'UTC',
        status: 'active',
        accountType: 'free',
        failedLoginAttempts: 5
    });
}