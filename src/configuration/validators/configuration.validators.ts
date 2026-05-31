import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

function toBoolean(value: unknown) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value !== 'string') {
    return value;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (['true', '1', 'yes', 'on'].includes(normalizedValue)) {
    return true;
  }

  if (['false', '0', 'no', 'off', ''].includes(normalizedValue)) {
    return false;
  }

  return value;
}

export class EnvironmentValidator {
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  PORT: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value
          .split(',')
          .map((origin: string) => origin.trim())
          .filter(Boolean)
      : value,
  )
  CORS_ORIGINS: string[];

  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  DOTNET_API_BASE_URL: string;

  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  PYTHON_API_BASE_URL: string;

  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  SERVICE_REQUEST_TIMEOUT_MS: number;

  @IsBoolean()
  @Transform(({ value }) => toBoolean(value))
  USE_DUMMY_PREDICTIONS = false;
}
