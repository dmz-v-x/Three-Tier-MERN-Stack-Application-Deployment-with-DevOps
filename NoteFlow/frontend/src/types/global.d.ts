declare global {
  interface Window {
    APP_CONFIG:
      | {
          API_URL: string;
          NODE_ENV: "development" | "production" | "test";
        }
      | undefined;
  }
}

export {};
