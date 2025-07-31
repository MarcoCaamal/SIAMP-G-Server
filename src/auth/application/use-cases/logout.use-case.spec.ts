import { TestingModule, Test } from "@nestjs/testing";
import { getModelToken, MongooseModule } from "@nestjs/mongoose";

import { MongoMemoryServer } from "mongodb-memory-server";
import { Model } from "mongoose";

import { LogoutUseCase } from "./logout.use-case";
import { RefreshTokenDocument, RefreshTokenSchema } from "../../infrastructure/schemas/refresh-token.schema";
import { REFRESH_TOKEN_REPOSITORY } from "../../domain/repositories/refresh-token.repository.interface";
import { RefreshTokenRepository } from "../../infrastructure/repositories/refresh-token.repository";



describe('Logout Use Case', () => {
    let mongodb: MongoMemoryServer;
    let testModule: TestingModule;
    let logoutUseCase: LogoutUseCase;

    beforeAll(async () => {
        mongodb = await MongoMemoryServer.create();
        testModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRoot(mongodb.getUri()),
                MongooseModule.forFeature([
                    { name: RefreshTokenDocument.name, schema: RefreshTokenSchema },
                ]),
            ],
            providers: [
                LogoutUseCase,
                {
                    provide: REFRESH_TOKEN_REPOSITORY,
                    useClass: RefreshTokenRepository,
                },
            ],
        }).compile();

        logoutUseCase = testModule.get<LogoutUseCase>(LogoutUseCase);
        await createTestData(testModule);
    });

    afterAll(async () => {
        await dropUserTestData(testModule);
        await mongodb.stop();
        await testModule.close();
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