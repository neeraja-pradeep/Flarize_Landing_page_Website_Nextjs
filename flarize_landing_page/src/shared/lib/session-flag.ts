import "client-only";

/** sessionStorage can throw (private mode, blocked storage); treat that as "unset". */
export function readSessionFlag(key: string): boolean {
  try {
    return window.sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

export function writeSessionFlag(key: string): void {
  try {
    window.sessionStorage.setItem(key, "1");
  } catch {
    /* storage unavailable: the flag simply won't persist */
  }
}
