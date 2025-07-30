import e from "express";
import { LoginAttempt } from "./login-attempt.entity";

describe('LoginAttempt entity', () => {
  it('should create a LoginAttempt instance', () => {
    const loginAttempt = new LoginAttempt(
      'userid',
      'email@example.com',
      true,
      '192.168.0.1',
      'Chrome',
      new Date(),
      undefined
    );
    expect(loginAttempt).toBeInstanceOf(LoginAttempt);
  });

  it('should create a success LoginAttempt with static method', () => {
    const successAttempt = LoginAttempt.success(
      'userid',
      'email@example.com',
      '192.168.0.1',
      'Chrome'
    );
    expect(successAttempt).toBeInstanceOf(LoginAttempt);
    expect(successAttempt.success).toBe(true);
  });

  it('should create a failure LoginAttempt with static method', () => {
    const failureAttempt = LoginAttempt.failure(
      'userid',
      'email@example.com',
      '192.168.0.1',
      'Chrome',
      'Invalid credentials'
    );
    expect(failureAttempt).toBeInstanceOf(LoginAttempt);
    expect(failureAttempt.success).toBe(false);
  });

});
