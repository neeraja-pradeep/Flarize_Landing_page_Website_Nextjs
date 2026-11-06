import type { Failure } from '../error/failure';

// Map any thrown HTTP/network error into a clean Failure.
export function toFailure(error: unknown): Failure {
  // TODO: inspect axios error status codes and map accordingly.
  return { type: 'unknown', message: String(error) };
}
