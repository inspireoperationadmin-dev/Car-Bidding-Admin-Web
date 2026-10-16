const env = import.meta.env;

export const APP_ENV = {
  apiBaseUrl: env.VITE_API_BASE_URL || "http://localhost:3000/api",
} as const;
