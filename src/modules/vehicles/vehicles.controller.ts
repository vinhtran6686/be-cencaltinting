import { Controller, Get, Query } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Public } from '../../shared/decorators/auth.decorator';

@ApiTags('vehicles')
@Controller('/vehicles')
@Public()
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Get('years')
  @ApiOperation({ summary: 'Get list of available vehicle years' })
  @ApiResponse({ status: 200, description: 'Array of years' })
  async getYears() {
    return this.vehiclesService.getYears();
  }

  @Get('makes')
  @ApiOperation({ summary: 'Get list of available vehicle makes (manufacturers)' })
  @ApiQuery({ name: 'year', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Array of makes' })
  async getMakes(@Query('year') year?: string) {
    return this.vehiclesService.getMakes(year);
  }

  @Get('models')
  @ApiOperation({ summary: 'Get list of available vehicle models' })
  @ApiQuery({ name: 'year', required: false, type: String })
  @ApiQuery({ name: 'make', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Array of models' })
  async getModels(
    @Query('year') year?: string,
    @Query('make') make?: string,
  ) {
    return this.vehiclesService.getModels(year, make);
  }

  @Get('types')
  @ApiOperation({ summary: 'Get list of available vehicle types' })
  @ApiResponse({ status: 200, description: 'Array of vehicle types' })
  async getTypes() {
    return this.vehiclesService.getTypes();
  }
} 