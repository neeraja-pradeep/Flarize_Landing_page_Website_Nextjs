import type { Result } from '@/core/error/result';
import type { Failure } from '@/core/error/failure';
import type { Profile } from '../entities/profile';

// ABSTRACT contract only — no implementation.
export interface ProfileRepository {
  getAll(): Promise<Result<Profile[], Failure>>;
}
