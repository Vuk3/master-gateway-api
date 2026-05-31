export type EnvVariables = {
  PORT: number;
  CORS_ORIGINS: string[];
  DOTNET_API_BASE_URL: string;
  PYTHON_API_BASE_URL: string;
  SERVICE_REQUEST_TIMEOUT_MS: number;
  USE_DUMMY_PREDICTIONS: boolean;
};
