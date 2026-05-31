import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EnvironmentValidator } from '../validators/configuration.validators';

export function validateConfig(config: Record<string, any>) {
  const validatedConfig = plainToInstance(EnvironmentValidator, config, {
    enableImplicitConversion: false,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    whitelist: true,
    forbidNonWhitelisted: false,
  });

  if (errors.length > 0) {
    throw new Error(
      `Invalid environment variables: ${errors.map((err) => err.toString()).join(', ')}`,
    );
  }

  return validatedConfig;
}
