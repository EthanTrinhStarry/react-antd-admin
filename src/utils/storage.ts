export const STORAGE_KEYS = {
  locale: 'locale',
  newUser: 'newUser',
  role: 'role',
  theme: 'theme',
  token: 't',
  username: 'username',
} as const;

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const browserStorage = {
  get(key: StorageKey) {
    try {
      return getStorage()?.getItem(key) ?? null;
    } catch {
      return null;
    }
  },

  getBoolean(key: StorageKey, fallback: boolean) {
    const value = this.get(key);

    if (value === 'true') return true;
    if (value === 'false') return false;

    return fallback;
  },

  set(key: StorageKey, value: string | boolean) {
    try {
      getStorage()?.setItem(key, String(value));
    } catch {
      // Storage can be unavailable in private browsing or restricted contexts.
    }
  },

  remove(...keys: StorageKey[]) {
    const storage = getStorage();

    if (!storage) return;

    try {
      keys.forEach(key => storage.removeItem(key));
    } catch {
      // Keep application state usable even when persistence is unavailable.
    }
  },
};
