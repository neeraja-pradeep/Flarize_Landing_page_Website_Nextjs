import type { Result } from '@/core/error/result';
import type { Failure } from '@/core/error/failure';
import type { Auth } from '../entities/auth';

// ABSTRACT contract only — no implementation.
export interface AuthRepository {
  getAll(): Promise<Result<Auth[], Failure>>;
}
