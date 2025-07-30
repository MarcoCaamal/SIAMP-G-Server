import { RefreshToken } from "./refresh-token.entity";

describe('RefreshToken entity', () => {
    it('should create a RefreshToken instance', () => {
        const refreshToken = new RefreshToken(
            'tokenid',
            'userid',
            'token',
            new Date(),
            false,
            new Date()
        );
        expect(refreshToken).toBeInstanceOf(RefreshToken);
    });

    it('should create a RefreshToken with static method', () => {
        const refreshToken = RefreshToken.create(
            'userid',
            'token',
            new Date()
        );
        expect(refreshToken).toBeInstanceOf(RefreshToken);
    });

    it('should check if the token is expired', () => {
        const expiredToken = RefreshToken.create(
            'userid',
            'token',
            new Date(Date.now() - 1000) // 1 second ago
        );
        expect(expiredToken.isExpired()).toBe(true);
    });

    it('should check if the token is valid', () => {
        const validToken = RefreshToken.create(
            'userid',
            'token',
            new Date(Date.now() + 1000) // 1 second in the future
        );
        expect(validToken.isExpired()).toBe(false);
    });

    it('should revoke the token', () => {
        const token = RefreshToken.create(
            'userid',
            'token',
            new Date(Date.now() + 1000) // 1 second in the future
        );
        const tokenRevoked = token.revoke();
        expect(tokenRevoked.isRevoked).toBe(true);
    });

});