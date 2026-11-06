import { ok, err } from 'neverthrow';
import type { Result } from '@/core/error/result';
import type { Failure } from '@/core/error/failure';
import { toFailure } from '@/core/network/network-exceptions';
import type { ProfileRepository } from '../../domain/repositories/profile-repository';
import type { Profile } from '../../domain/entities/profile';
import { profileApi } from '../datasources/remote/profile-api';
import { ProfileResponseSchema } from '../datasources/remote/profile-response.dto';

// Joins remote + local, validates responses, maps errors to Failure.
export class ProfileRepositoryImpl implements ProfileRepository {
  async getAll(): Promise<Result<Profile[], Failure>> {
    try {
      const res = await profileApi.list();
      const parsed = ProfileResponseSchema.array().parse(res.data);
      return ok(parsed as Profile[]);
    } catch (e) {
      return err(toFailure(e));
    }
  }
}

export const profileRepository = new ProfileRepositoryImpl();
