import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

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
}
