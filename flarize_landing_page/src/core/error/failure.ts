// Domain-level failure types. UI never sees raw network errors.
export type Failure =
  | { type: 'network'; message: string }
  | { type: 'notFound'; message: string }
  | { type: 'unauthorized'; message: string }
  | { type: 'unknown'; message: string };
