/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_ENV: 'development' | 'production' | 'test';
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
