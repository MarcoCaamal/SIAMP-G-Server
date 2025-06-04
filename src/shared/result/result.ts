import { ErrorResult } from './interfaces/error.interface';

export class Result<T> {
  private readonly _isSuccess: boolean;
  private readonly _error?: ErrorResult;
  private readonly _value?: T;

  private constructor(isSuccess: boolean, error?: ErrorResult, value?: T) {
    this._isSuccess = isSuccess;
    this._error = error;
    this._value = value;
  }

  public static ok<U>(value: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  public static fail<U>(error: ErrorResult): Result<U> {
    return new Result<U>(false, error);
  }

  get isSuccess(): boolean {
    return this._isSuccess;
  }

  get isFailure(): boolean {
    return !this._isSuccess;
  }

  get value(): T | undefined {
    return this._value;
  }

  get error(): ErrorResult | undefined {
    return this._error;
  }
}
