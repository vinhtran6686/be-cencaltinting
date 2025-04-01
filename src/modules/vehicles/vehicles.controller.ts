import { Controller, Get, Query } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Public } from '../../shared/decorators/auth.decorator';
import { IdValueItem } from './types/vehicle.types';

interface VehicleResponse {
  data: IdValueItem[];
  message: string;
}

@ApiTags('vehicles')
@Controller('/vehicles')
@Public()
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get('years')
  @ApiOperation({ summary: 'Get list of available vehicle years' })
  @ApiResponse({ status: 200, description: 'Array of years in ID+value format' })
  async getYears(): Promise<VehicleResponse> {
    const years = await this.vehiclesService.getYears();
    return {
      data: years,
      message: 'Vehicle years fetched successfully'
    };
  }

  @Get('makes')
  @ApiOperation({ summary: 'Get list of available vehicle makes (manufacturers)' })
  @ApiQuery({ name: 'year', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Array of makes in ID+value format' })
  async getMakes(@Query('year') year?: string): Promise<VehicleResponse> {
    const makes = await this.vehiclesService.getMakes(year);
    return {
      data: makes,
      message: 'Vehicle makes fetched successfully'
    };
  }

  @Get('models')
  @ApiOperation({ summary: 'Get list of available vehicle models' })
  @ApiQuery({ name: 'year', required: false, type: String })
  @ApiQuery({ name: 'make', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Array of models in ID+value format' })
  async getModels(
    @Query('year') year?: string,
    @Query('make') make?: string,
  ): Promise<VehicleResponse> {
    const models = await this.vehiclesService.getModels(year, make);
    return {
      data: models,
      message: 'Vehicle models fetched successfully'
    };
  }

  @Get('types')
  @ApiOperation({ summary: 'Get list of available vehicle types' })
  @ApiResponse({ status: 200, description: 'Array of vehicle types in ID+value format' })
  async getTypes(): Promise<VehicleResponse> {
    const types = await this.vehiclesService.getTypes();
    return {
      data: types,
      message: 'Vehicle types fetched successfully'
    };
  }
} 