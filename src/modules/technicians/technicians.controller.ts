import { Controller, Get, Param, Query } from '@nestjs/common';
import { TechniciansService } from './technicians.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Public } from '../../shared/decorators/auth.decorator';

@ApiTags('technicians')
@Controller('/technicians')
@Public()
export class TechniciansController {
  constructor(private readonly techniciansService: TechniciansService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of technicians' })
  @ApiResponse({ status: 200, description: 'List of technicians with availability information' })
  async findAll() {
    return this.techniciansService.findAll();
  }

  @Get(':id/availability')
  @ApiOperation({ summary: 'Get technician availability for a specific date range' })
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Available time slots for the technician' })
  @ApiResponse({ status: 404, description: 'Technician not found' })
  async getAvailability(
    @Param('id') id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.techniciansService.getAvailability(id, startDate, endDate);
  }
} 