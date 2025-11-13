import { IsString, IsNumber, IsBoolean, IsArray, IsUrl, IsOptional, ValidateNested, IsEnum, IsDefined } from 'class-validator';
import { Type } from 'class-transformer';

export class Databasesecret {
  @IsString()
  @IsDefined()
  host: string;

  @IsString()
  @IsDefined()
  database: string;

  @IsString()
  @IsDefined()
  port: string;
}

export enum AppEnvironment {
    local = 'local',
    DEV = 'dev',
    PROD = 'prod',
    TEST = 'test'
}

export class AppConfig {

    @IsEnum(AppEnvironment)
    APP_ENV: AppEnvironment;

} 