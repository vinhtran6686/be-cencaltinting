import { Controller, Get, Post, Body, Param, Put, Delete, Query, Logger } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Public } from '../../shared/decorators/auth.decorator';
import { IdLabelItem } from './types/vehicle.types';

@ApiTags('appointments')
@Controller('/appointments')
@Public()
export class AppointmentsController {
  private readonly logger = new Logger(AppointmentsController.name);

  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('vehicle/test')
  @ApiOperation({ summary: 'Test endpoint for vehicle data format' })
  testVehicleDataFormat() {
    // Hardcoded test data in the expected format
    const testData: IdLabelItem[] = [
      { id: '2024', value: '2024' },
      { id: '2023', value: '2023' },
      { id: '2022', value: '2022' }
    ];
    
    this.logger.debug(`Test data: ${JSON.stringify(testData)}`);
    
    return {
      data: testData,
      message: 'Test data retrieved successfully'
    };
  }

  @Get('vehicle/years')
  @ApiOperation({ summary: 'Get list of available vehicle years' })
  @ApiResponse({ status: 200, description: 'List of vehicle years in ID+value format' })
  async getVehicleYears() {
    this.logger.debug('GET /appointments/vehicle/years called');
    const years = await this.appointmentsService.getVehicleYears();
    return {
      data: years,
      message: 'Vehicle years fetched successfully'
    };
  }

  @Get('vehicle/makes')
  @ApiOperation({ summary: 'Get list of available vehicle makes/manufacturers' })
  @ApiQuery({ name: 'year', required: false, type: String, description: 'Filter makes by year' })
  @ApiResponse({ status: 200, description: 'List of vehicle makes in ID+value format' })
  async getVehicleMakes(@Query('year') year?: string) {
    this.logger.debug(`GET /appointments/vehicle/makes called with year=${year || 'undefined'}`);
    const makes = await this.appointmentsService.getVehicleMakes(year);
    return {
      data: makes,
      message: 'Vehicle makes fetched successfully'
    };
  }

  @Get('vehicle/models')
  @ApiOperation({ summary: 'Get list of available vehicle models' })
  @ApiQuery({ name: 'year', required: false, type: String, description: 'Filter models by year' })
  @ApiQuery({ name: 'make', required: false, type: String, description: 'Filter models by make' })
  @ApiResponse({ status: 200, description: 'List of vehicle models in ID+value format' })
  async getVehicleModels(
    @Query('year') year?: string,
    @Query('make') make?: string,
  ) {
    this.logger.debug(`GET /appointments/vehicle/models called with year=${year || 'undefined'}, make=${make || 'undefined'}`);
    const models = await this.appointmentsService.getVehicleModels(year, make);
    return {
      data: models,
      message: 'Vehicle models fetched successfully'
    };
  }

  @Get('vehicle/types')
  @ApiOperation({ summary: 'Get list of available vehicle types' })
  @ApiQuery({ name: 'year', required: false, type: String, description: 'Filter types by year' })
  @ApiQuery({ name: 'make', required: false, type: String, description: 'Filter types by make' })
  @ApiQuery({ name: 'model', required: false, type: String, description: 'Filter types by model' })
  @ApiResponse({ status: 200, description: 'List of vehicle types in ID+value format' })
  async getVehicleTypes(
    @Query('year') year?: string,
    @Query('make') make?: string,
    @Query('model') model?: string,
  ) {
    this.logger.debug(`GET /appointments/vehicle/types called with year=${year || 'undefined'}, make=${make || 'undefined'}, model=${model || 'undefined'}`);
    const types = await this.appointmentsService.getVehicleTypes(year, make, model);
    return {
      data: types,
      message: 'Vehicle types fetched successfully'
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get list of appointments with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of appointments with pagination metadata' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('search') search?: string,
  ) {
    this.logger.debug('GET /appointments called');
    this.logger.debug(`Query params: page=${page}, limit=${limit}, status=${status || 'undefined'}, startDate=${startDate || 'undefined'}, endDate=${endDate || 'undefined'}, search=${search || 'undefined'}`);
    
    try {
      const result = await this.appointmentsService.findAll({
        page: +page,
        limit: +limit,
        status,
        startDate,
        endDate,
        search,
      });
      
      this.logger.debug(`Returning ${result?.data?.length || 0} appointments`);
      return result;
    } catch (error) {
      this.logger.error(`Error in findAll: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment details by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Detailed appointment information' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async findOne(@Param('id') id: string) {
    this.logger.debug(`GET /appointments/${id} called`);
    return this.appointmentsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new appointment' })
  @ApiResponse({ status: 201, description: 'Created appointment details' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    this.logger.debug('POST /appointments called');
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update existing appointment' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Updated appointment details' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    this.logger.debug(`PUT /appointments/${id} called`);
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel/delete appointment' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Success message' })
  @ApiResponse({ status: 404, description: 'Appointment not found' })
  async remove(@Param('id') id: string) {
    this.logger.debug(`DELETE /appointments/${id} called`);
    return this.appointmentsService.remove(id);
  }
} 