import { TestingModule, Test } from "@nestjs/testing";
import { getModelToken, MongooseModule } from "@nestjs/mongoose";

import { Model } from "mongoose";

import { LogoutUseCase } from "./logout.use-case";
import { RefreshTokenDocument, RefreshTokenSchema } from "../../infrastructure/schemas/refresh-token.schema";
import { setUpAuthTestingModule, tearDownAuthTestingModule } from "../../testing/configure-auth-module";



describe('Logout Use Case', () => {
    let testModule: TestingModule;
    let logoutUseCase: LogoutUseCase;

    beforeAll(async () => {
        testModule = await setUpAuthTestingModule();
        logoutUseCase = testModule.get<LogoutUseCase>(LogoutUseCase);
    });

    afterAll(async () => {
        await tearDownAuthTestingModule();
    });

    it('should log out the user', async () => {
        const result = await logoutUseCase.execute('test-refresh-token');
        expect(result.isSuccess).toBeTruthy();
    });
});

const createTestData = async (testingModule: TestingModule) => {
    const refreshTokenModel: Model<RefreshTokenDocument> = testingModule.get(getModelToken(RefreshTokenDocument.name));
    const refreshToken = await refreshTokenModel.create({
        userId: 'test-user-id',
        token: 'test-refresh-token',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour from now
        isRevoked: false,
    });
};

const dropUserTestData = async (testingModule: TestingModule) => {
    const refreshTokenModel: Model<RefreshTokenDocument> = testingModule.get(getModelToken(RefreshTokenDocument.name));
    await refreshTokenModel.deleteMany({});
};