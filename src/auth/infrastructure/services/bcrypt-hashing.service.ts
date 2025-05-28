import { Injectable } from '@nestjs/common';
import { IHashingService } from '../../application/interfaces/hashing.service.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptHashingService implements IHashingService {
  private readonly saltRounds = 12;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
