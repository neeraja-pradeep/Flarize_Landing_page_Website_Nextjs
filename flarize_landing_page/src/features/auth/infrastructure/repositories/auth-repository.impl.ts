import { ok, err } from 'neverthrow';
import type { Result } from '@/core/error/result';
import type { Failure } from '@/core/error/failure';
import { toFailure } from '@/core/network/network-exceptions';
import type { AuthRepository } from '../../domain/repositories/auth-repository';
import type { Auth } from '../../domain/entities/auth';
import { authApi } from '../datasources/remote/auth-api';
import { AuthResponseSchema } from '../datasources/remote/auth-response.dto';

// Joins remote + local, validates responses, maps errors to Failure.
export class AuthRepositoryImpl implements AuthRepository {
  async getAll(): Promise<Result<Auth[], Failure>> {
    try {
      const res = await authApi.list();
      const parsed = AuthResponseSchema.array().parse(res.data);
      return ok(parsed as Auth[]);
    } catch (e) {
      return err(toFailure(e));
    }
  }
}

export const authRepository = new AuthRepositoryImpl();
