// Local data source (localStorage / IndexedDB). ONLY if caching is genuinely needed.
export const profileLocalDs = {
  read: () => null,
  write: (_data: unknown) => {},
};
