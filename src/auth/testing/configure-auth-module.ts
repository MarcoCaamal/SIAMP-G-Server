import { getModelToken, MongooseModule } from "@nestjs/mongoose";
import { TestingModule, Test } from "@nestjs/testing";
import { JwtModule } from "@nestjs/jwt";

import { Model } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

import { JWT_SERVICE } from "../application/interfaces/jwt.service.interface";
import { AUTH_REPOSITORY } from "../domain/repositories/auth.repository.interface";
import { REFRESH_TOKEN_REPOSITORY } from "../domain/repositories/refresh-token.repository.interface";
import { BcryptHashingService, NestJwtService } from "../infrastructure/services";
import { AuthRepository } from "../infrastructure/repositories/auth.repository";
import { RefreshTokenRepository } from "../infrastructure/repositories/refresh-token.repository";
import { HASHING_SERVICE } from "../application/interfaces";
import { RefreshTokenDocument, RefreshTokenSchema } from "../infrastructure/schemas/refresh-token.schema";
import { UserDocument, UserSchema } from "../../users/infrastructure/schemas/user.schema";
import { USER_REPOSITORY } from "../../users/domain/repositories/user.repository.interface";
import { UserRepository } from "../../users/infrastructure/repositories/user.repository";
import { LoginUseCase, LogoutUseCase, RefreshTokenUseCase } from "../application/use-cases";

let testingModule: TestingModule;
let mongoDb: MongoMemoryServer;

const clearDatabase = async () => {
    const userModel: Model<UserDocument> = testingModule.get(getModelToken(UserDocument.name));
    const refreshTokenModel: Model<RefreshTokenDocument> = testingModule.get(getModelToken(RefreshTokenDocument.name));
    await userModel.deleteMany({});
    await refreshTokenModel.deleteMany({});
};

export const setUpAuthTestingModule = async () => {
    mongoDb = await MongoMemoryServer.create();
    testingModule = await Test.createTestingModule({
        imports: [
            MongooseModule.forRoot(mongoDb.getUri()),
            MongooseModule.forFeature([
                { name: UserDocument.name, schema: UserSchema },
            ]),
            MongooseModule.forFeature([
                { name: RefreshTokenDocument.name, schema: RefreshTokenSchema },
            ]),
            JwtModule.register({
                global: true,
            }),
        ],
        providers: [
            LoginUseCase,
            LogoutUseCase,
            RefreshTokenUseCase,
            {
                provide: USER_REPOSITORY,
                useClass: UserRepository,
            },
            {
                provide: AUTH_REPOSITORY,
                useClass: AuthRepository,
            },
            {
                provide: HASHING_SERVICE,
                useClass: BcryptHashingService,
            },
            {
                provide: JWT_SERVICE,
                useClass: NestJwtService,
            },
            {
                provide: REFRESH_TOKEN_REPOSITORY,
                useClass: RefreshTokenRepository,
            },
        ],
    }).compile();

    return testingModule;
};

export const tearDownAuthTestingModule = async () => {
    await clearDatabase();
    await testingModule.close();
    await mongoDb.stop();
};