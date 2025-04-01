import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType, Logger } from '@nestjs/common';
import { TransformInterceptor } from './shared/interceptors/transform/transform.interceptor';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;

  logger.log(`MongoDB URL: ${configService.get('MONGO_URL')}`);

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
    // prefix: 'api/v', // URLs will be: /api/v1/xxx, /api/v2/xxx
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  app.use(cookieParser(configService.get('COOKIE_SECRET')));

  // Định nghĩa CORS options
  const corsOptions: CorsOptions = {
    origin: true, // Cho phép tất cả origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'X-CSRF-Token',
      'X-Auth-Token',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials',
    ],
    exposedHeaders: [
      'Content-Range',
      'X-Total-Count',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials',
    ],
  };

  // Enable CORS với options đã định nghĩa
  app.enableCors(corsOptions);

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('CenCal Tinting API')
    .setDescription('API documentation for CenCal Tinting appointment system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  // Tạo document chỉ bao gồm các controllers trong thư mục modules
  const document = SwaggerModule.createDocument(app, config, {
    include: [
      require('./modules/appointments/appointments.module').AppointmentsModule,
      require('./modules/contacts/contacts.module').ContactsModule,
      require('./modules/vehicles/vehicles.module').VehiclesModule,
      require('./modules/services/services.module').ServicesModule,
      require('./modules/technicians/technicians.module').TechniciansModule,
      require('./modules/scheduling/scheduling.module').SchedulingModule,
    ],
  });
  
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
