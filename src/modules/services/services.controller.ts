import { Controller, Get, Param, Query } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Public } from '../../shared/decorators/auth.decorator';

@ApiTags('services')
@Controller('/services')
@Public()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get('packages')
  @ApiOperation({ summary: 'Get list of service packages' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'tag', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of packages with their services' })
  async getPackages(
    @Query('search') search?: string,
    @Query('tag') tag?: string,
  ) {
    return this.servicesService.getPackages(search, tag);
  }

  @Get('packages/:id')
  @ApiOperation({ summary: 'Get package details by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Detailed package information including all services' })
  @ApiResponse({ status: 404, description: 'Package not found' })
  async getPackage(@Param('id') id: string) {
    return this.servicesService.getPackage(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of individual services' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'tag', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of services' })
  async getServices(
    @Query('search') search?: string,
    @Query('tag') tag?: string,
  ) {
    return this.servicesService.getServices(search, tag);
  }

  @Get('tags')
  @ApiOperation({ summary: 'Get list of service tags for filtering' })
  @ApiResponse({ status: 200, description: 'Array of service tags' })
  async getTags() {
    return this.servicesService.getTags();
  }
} 