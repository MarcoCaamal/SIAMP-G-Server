import { TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";

import { Model } from "mongoose";


import { RefreshTokenUseCase } from "./refresh-token.use-case";
import { AUTH_REPOSITORY } from "../../domain/repositories/auth.repository.interface";
import { AuthRepository } from "../../infrastructure/repositories/auth.repository";
import { REFRESH_TOKEN_REPOSITORY } from "../../domain/repositories/refresh-token.repository.interface";
import { RefreshTokenRepository } from "../../infrastructure/repositories/refresh-token.repository";
import { User } from "../../../users/domain/entities/user.entity";
import { RefreshToken } from "../../domain/entities/refresh-token.entity";
import { setUpAuthTestingModule, tearDownAuthTestingModule } from "../../testing/configure-auth-module";
import { IJwtService, JWT_SERVICE } from "../interfaces";
import { RefreshTokenDto } from "../dto";
import { RefreshTokenDocument } from "../../infrastructure/schemas/refresh-token.schema";

describe('Refresh Token Use Case', () => {
    let testModule: TestingModule;
    let refreshTokenUseCase: RefreshTokenUseCase;

    beforeAll(async () => {
        testModule = await setUpAuthTestingModule();
        refreshTokenUseCase = testModule.get<RefreshTokenUseCase>(RefreshTokenUseCase);
        await createTestData(testModule);
    });

    afterAll(async () => {
        await tearDownAuthTestingModule();
    });

    it('should refresh token successfully', async () => {
        const refreshTokenModel: Model<RefreshTokenDocument> = testModule.get(getModelToken(RefreshTokenDocument.name));
        const existingToken = await refreshTokenModel.findOne();
        const refreshTokenDto: RefreshTokenDto = {
            refreshToken: existingToken!.token,
        };

        const result = await refreshTokenUseCase.execute(refreshTokenDto);
        expect(result).toBeDefined();
        expect(result.isSuccess).toBeTruthy();
        expect(result.value).toBeDefined();
    });
});


const createTestData = async (testingModule: TestingModule) => {
    const authRepository = testingModule.get<AuthRepository>(AUTH_REPOSITORY);
    const refreshTokenRepository = testingModule.get<RefreshTokenRepository>(REFRESH_TOKEN_REPOSITORY);
    const jwtService = testingModule.get<IJwtService>(JWT_SERVICE);

    const refreshTokenJwt = await jwtService.generateRefreshToken({
        sub: 'test-user-id',
        email: 'test@example.com',
        iat: Math.floor(Date.now() / 1000),
    });


    const user: User = User.create(
        'test-user-id',
        'test@example.com',
        'password',
    );

    const userSaved = await authRepository.saveUser(user.activate());
    const refreshToken = RefreshToken.create(
        userSaved.id,
        refreshTokenJwt,
        new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiration
    );

    await refreshTokenRepository.save(refreshToken);
};
