import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  ValidateNested, 
  IsBoolean,
  IsArray,
  IsDate,
  IsNumber,
  ArrayMinSize
} from 'class-validator';

class VehicleDetailsDto {
  @ApiProperty({ description: 'Vehicle year' })
  @IsString()
  @IsNotEmpty()
  readonly year: string;

  @ApiProperty({ description: 'Vehicle make/manufacturer' })
  @IsString()
  @IsNotEmpty()
  readonly make: string;

  @ApiProperty({ description: 'Vehicle model' })
  @IsString()
  @IsNotEmpty()
  readonly model: string;

  @ApiProperty({ description: 'Type of vehicle' })
  @IsString()
  @IsNotEmpty()
  readonly vehicleType: string;

  @ApiProperty({ description: 'Whether vehicle is custom entry or from database' })
  @IsBoolean()
  @IsOptional()
  readonly isCustomEntry?: boolean;
}

class AppointmentServiceDto {
  @ApiProperty({ description: 'ID of the service package' })
  @IsString()
  @IsNotEmpty()
  readonly packageId: string;

  @ApiProperty({ description: 'IDs of the individual services within the package', type: [String] })
  @IsArray()
  @IsString({ each: true })
  readonly serviceIds: string[];

  @ApiProperty({ description: 'Estimated time in minutes' })
  @IsNumber()
  readonly estimatedTime: number;

  @ApiProperty({ description: 'ID of assigned technician' })
  @IsString()
  @IsNotEmpty()
  readonly technicianId: string;

  @ApiProperty({ description: 'Service start date' })
  @IsString()
  @IsNotEmpty()
  readonly startDate: string;

  @ApiProperty({ description: 'Service start time in HH:MM format' })
  @IsString()
  @IsNotEmpty()
  readonly startTime: string;
}

export class CreateAppointmentDto {
  @ApiProperty({ description: 'ID of the customer contact' })
  @IsString()
  @IsNotEmpty()
  readonly contactId: string;

  @ApiProperty({ description: 'Vehicle details', type: VehicleDetailsDto })
  @ValidateNested()
  @Type(() => VehicleDetailsDto)
  readonly vehicleDetails: VehicleDetailsDto;

  @ApiProperty({ description: 'Services included in appointment', type: [AppointmentServiceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => AppointmentServiceDto)
  readonly services: AppointmentServiceDto[];

  @ApiProperty({ description: 'Appointment start date' })
  @IsString()
  @IsNotEmpty()
  readonly startDate: string;

  @ApiProperty({ description: 'Additional notes for the appointment' })
  @IsString()
  @IsOptional()
  readonly notes?: string;
} 