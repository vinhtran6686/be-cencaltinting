import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, HttpException, UnauthorizedException, ForbiddenException, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { EasyPlayersService } from './easyplayers.service';
import { CreateEasyPlayerDto } from './dto/create-easyplayer.dto';
import { UpdateEasyPlayerDto } from './dto/update-easyplayer.dto';
import { Public } from '../shared/decorators/auth.decorator'; 
@Controller('easyplayers')
export class EasyPlayersController {
  constructor(private readonly easyPlayersService: EasyPlayersService) {}

  @Post()
  async create(@Body() createEasyPlayerDto: CreateEasyPlayerDto) {
    return this.easyPlayersService.create(createEasyPlayerDto);
  }

  @Get()
  async findAll() {
    return this.easyPlayersService.findAll();
  }

  @Get('test')
  @HttpCode(HttpStatus.OK)
  async adminTest() {
    return { status: 'ok', message: 'Test endpoint working' };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.easyPlayersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEasyPlayerDto: UpdateEasyPlayerDto) {
    return this.easyPlayersService.update(id, updateEasyPlayerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.easyPlayersService.remove(id);
  }

  /**
   * Test API endpoints specifically for frontend notification testing
   */
  @Public()
  @Get('notifications/success')
  async getSuccessNotification() {
    return {
      success: true,
      message: 'Operation completed successfully',
      statusCode: HttpStatus.OK,
      data: {
        timestamp: new Date().toISOString(),
        id: 'success-notification-1',
      },
    };
  }

  @Public()
  @Get('notifications/error')
  async getErrorNotification() {
    throw new HttpException(
      {
        success: false,
        error: 'Operation failed',
        message: 'There was an error processing your request',
        code: 'ERR_OPERATION_FAILED',
        statusCode: HttpStatus.BAD_REQUEST,
        data: {
          timestamp: new Date().toISOString(),
          id: 'error-notification-1',
        },
      },
      HttpStatus.BAD_REQUEST
    );
  }

  @Public()
  @Get('notifications/warning')
  async getWarningNotification() {
    return {
      success: true,
      warning: true,
      message: 'Operation completed with warnings',
      data: {
        timestamp: new Date().toISOString(),
        id: 'warning-notification-1',
        warnings: ['Some data might be incomplete', 'Process took longer than expected'],
      },
    };
  }

  @Public()
  @Get('notifications/info')
  async getInfoNotification() {
    return {
      success: true,
      info: true,
      message: 'Information notification',
      data: {
        timestamp: new Date().toISOString(),
        id: 'info-notification-1',
        details: 'This is an informational notification for testing purposes',
      },
    };
  }

  @Public()
  @Get('notifications/generate-error')
  async generateError(@Query('statusCode') statusCode: string) {
    const code = parseInt(statusCode, 10) || 500;
    const errorMessages = {
      400: 'Bad Request Error',
      401: 'Unauthorized Error',
      403: 'Forbidden Error',
      404: 'Not Found Error',
      500: 'Internal Server Error',
    };
    
    const message = errorMessages[code] || 'Generic Error';
    
    throw new HttpException(
      {
        success: false,
        error: message,
        code: `ERR_${code}`,
        statusCode: code,
        data: {
          timestamp: new Date().toISOString(),
          details: `This is a simulated ${code} error`,
        },
      },
      code
    );
  }

  @Public()
  @Get('notifications/unauthorized')
  async getUnauthorizedError() {
    throw new UnauthorizedException({
      success: false,
      error: 'Unauthorized access',
      message: 'You do not have permission to access this resource',
      code: 'ERR_UNAUTHORIZED',
      statusCode: 401,
      data: {
        timestamp: new Date().toISOString(),
        id: 'unauthorized-error-1',
      },
    });
  }

  @Public()
  @Get('notifications/forbidden')
  async getForbiddenError() {
    throw new ForbiddenException({
      success: false,
      error: 'Forbidden access',
      message: 'Access to this resource is forbidden',
      code: 'ERR_FORBIDDEN',
      statusCode: 403,
      data: {
        timestamp: new Date().toISOString(),
        id: 'forbidden-error-1',
      },
    });
  }

  @Public()
  @Get('notifications/not-found')
  async getNotFoundError() {
    throw new NotFoundException({
      success: false,
      error: 'Resource not found',
      message: 'The requested resource could not be found',
      code: 'ERR_NOT_FOUND',
      statusCode: 404,
      data: {
        timestamp: new Date().toISOString(),
        id: 'not-found-error-1',
      },
    });
  }

  @Public()
  @Get('notifications/server-error')
  async getServerError() {
    throw new InternalServerErrorException({
      success: false,
      error: 'Server error',
      message: 'An internal server error occurred',
      code: 'ERR_SERVER_ERROR',
      statusCode: 500,
      data: {
        timestamp: new Date().toISOString(),
        id: 'server-error-1',
      },
    });
  }

  @Public()
  @Get('notifications/delayed')
  async getDelayedResponse(@Query('seconds') seconds: string) {
    const delay = parseInt(seconds, 10) || 3;
    return this.easyPlayersService.delayedResponse(delay);
  }

  @Public()
  @Get('notifications/random')
  async getRandomResponse() {
    return this.easyPlayersService.generateRandomResponse();
  }

  @Public()
  @Get('notifications/validation-error')
  async getValidationError() {
    throw new BadRequestException({
      success: false,
      error: 'Validation Error',
      message: 'The submitted data failed validation',
      code: 'ERR_VALIDATION',
      statusCode: 400,
      data: {
        timestamp: new Date().toISOString(),
        id: 'validation-error-1',
        validationErrors: [
          {
            field: 'email',
            message: 'Email is invalid',
          },
          {
            field: 'password',
            message: 'Password must be at least 8 characters',
          }
        ]
      },
    });
  }
} 