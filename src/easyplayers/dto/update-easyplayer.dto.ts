import { IsArray, IsBoolean, IsEmail, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateEasyPlayerDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;

  @IsOptional()
  @IsNumber()
  readonly score?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly tags?: string[];

  @IsOptional()
  @IsObject()
  readonly metadata?: Record<string, any>;
} 