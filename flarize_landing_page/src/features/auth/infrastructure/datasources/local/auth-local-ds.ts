// Local data source (localStorage / IndexedDB). ONLY if caching is genuinely needed.
export const authLocalDs = {
  read: () => null,
  write: (_data: unknown) => {},
};
