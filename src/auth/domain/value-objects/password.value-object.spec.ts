import { Password } from "./password.value-object";

describe('Password value object', () => {
    it('should create a valid password', () => {
        const password = new Password('ValidPassword123!#');
        expect(password).toBeInstanceOf(Password);
    });

    it('should not create a password with empty value', () => {
        expect(() => new Password('')).toThrow('Password cannot be empty');
    });

    it('should not create a password less than 8 characters', () => {
        expect(() => new Password('short')).toThrow('Password must be at least 8 characters long');
    });

    it('should not create a password without uppercase letter', () => {
        expect(() => new Password('validpassword123!#')).toThrow('Password must contain at least one uppercase letter');
    });

    it('should not create a password without lowercase letter', () => {
        expect(() => new Password('VALIDPASSWORD123!#')).toThrow('Password must contain at least one lowercase letter');
    });

    it('should not create a password without a number', () => {
        expect(() => new Password('ValidPassword!#')).toThrow('Password must contain at least one number');
    });

    it('should not create a password without a special character', () => {
        expect(() => new Password('ValidPassword123')).toThrow('Password must contain at least one special character');
    });

    it('should return the password value', () => {
        const password = new Password('ValidPassword123!#');
        expect(password.value).toBe('ValidPassword123!#');
    });
});
