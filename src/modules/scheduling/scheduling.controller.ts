import { Controller, Get, Query } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Public } from '../../shared/decorators/auth.decorator';

@ApiTags('scheduling')
@Controller('/scheduling')
@Public()
export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) {}

  @Get('available-slots')
  @ApiOperation({ summary: 'Get available time slots for scheduling' })
  @ApiQuery({ name: 'date', required: true, type: String })
  @ApiQuery({ name: 'serviceIds', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Array of available time slots' })
  async getAvailableSlots(
    @Query('date') date: string,
    @Query('serviceIds') serviceIds?: string,
  ) {
    // Convert string to array if needed
    const parsedServiceIds = serviceIds 
      ? serviceIds.split(',')
      : [];
      
    return this.schedulingService.getAvailableSlots(date, parsedServiceIds);
  }

  @Get('calculate-end-time')
  @ApiOperation({ summary: 'Calculate estimated end time based on services and start time' })
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'startTime', required: true, type: String })
  @ApiQuery({ name: 'serviceIds', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Calculated end date and time' })
  async calculateEndTime(
    @Query('startDate') startDate: string,
    @Query('startTime') startTime: string,
    @Query('serviceIds') serviceIds: string,
  ) {
    // Convert string to array
    const parsedServiceIds = serviceIds.split(',');
      
    return this.schedulingService.calculateEndTime(
      startDate,
      startTime,
      parsedServiceIds,
    );
  }
} 