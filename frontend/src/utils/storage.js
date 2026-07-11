const TOKEN_KEY = "intelliresume_token";
const USER_KEY = "intelliresume_user";
const THEME_KEY = "intelliresume_theme";

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export const userStorage = {
  get: () => {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },
  set: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clear: () => localStorage.removeItem(USER_KEY),
};

export const themeStorage = {
  get: () => localStorage.getItem(THEME_KEY),
  set: (theme) => localStorage.setItem(THEME_KEY, theme),
  clear: () => localStorage.removeItem(THEME_KEY),
};
