export interface IHashingService {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

export const HASHING_SERVICE = Symbol('HASHING_SERVICE');
