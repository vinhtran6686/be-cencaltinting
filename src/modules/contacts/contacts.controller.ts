import { Controller, Get, Post, Body, Param, Put, Delete, Query, Logger } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Public } from '../../shared/decorators/auth.decorator';

@ApiTags('contacts')
@Controller('/contacts')
@Public()
export class ContactsController {
  private readonly logger = new Logger(ContactsController.name);

  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of contacts with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'List of contacts with pagination metadata' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ) {
    this.logger.debug('GET /contacts called');
    this.logger.debug(`Query params: page=${page}, limit=${limit}, search=${search || 'undefined'}`);
    
    try {
      const result = await this.contactsService.findAll({
        page: +page,
        limit: +limit,
        search,
      });
      
      this.logger.debug(`Returning ${result?.data?.length || 0} contacts`);
      return result;
    } catch (error) {
      this.logger.error(`Error in findAll: ${error.message}`, error.stack);
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact details by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Detailed contact information' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async findOne(@Param('id') id: string) {
    this.logger.debug(`GET /contacts/${id} called`);
    return this.contactsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new contact' })
  @ApiResponse({ status: 201, description: 'Created contact details' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createContactDto: CreateContactDto) {
    this.logger.debug('POST /contacts called');
    return this.contactsService.create(createContactDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update existing contact' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Updated contact details' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    this.logger.debug(`PUT /contacts/${id} called`);
    return this.contactsService.update(id, updateContactDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete contact' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Success message' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async remove(@Param('id') id: string) {
    this.logger.debug(`DELETE /contacts/${id} called`);
    return this.contactsService.remove(id);
  }
} 