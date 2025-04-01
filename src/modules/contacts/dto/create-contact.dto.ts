import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ description: 'Contact name' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ description: 'Contact email address' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ description: 'Contact phone number' })
  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  @ApiProperty({ description: 'Additional information about the contact' })
  @IsString()
  @IsOptional()
  readonly additionalInformation?: string;

  @ApiProperty({ description: 'Notes about the contact' })
  @IsString()
  @IsOptional()
  readonly notes?: string;
} 