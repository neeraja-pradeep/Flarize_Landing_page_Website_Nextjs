import { authRepository } from '../../infrastructure/repositories/auth-repository.impl';

// Thin usecase — one action, calls the repository.
export function fetchAuth() {
  return authRepository.getAll();
}
