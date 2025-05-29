export class Email {
  private readonly _value: string;
  constructor(value: string) {
    const normalizedValue = value?.toLowerCase().trim();
    this.validate(normalizedValue);
    this._value = normalizedValue;
  }

  get value(): string {
    return this._value;
  }
  private validate(email: string): void {
    if (!email) {
      throw new Error('Email cannot be empty');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }
}
