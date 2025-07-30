import { Email } from "./email.value-object";

describe('Email value object', () => {
    it('should create a valid email', () => {
        const email = new Email('test@example.com');
        expect(email).toBeInstanceOf(Email);
    });

    it('should not create an email with invalid format', () => {
        expect(() => new Email('invalid-email')).toThrow('Invalid email format');
    });

    it('should not create an email with empty value', () => {
        expect(() => new Email('')).toThrow('Email cannot be empty');
    });

    it('should return the email address', () => {
        const email = new Email('test@example.com');
        expect(email.value).toBe('test@example.com');
    });
});
