import { profileRepository } from '../../infrastructure/repositories/profile-repository.impl';

// Thin usecase — one action, calls the repository.
export function fetchProfile() {
  return profileRepository.getAll();
}
