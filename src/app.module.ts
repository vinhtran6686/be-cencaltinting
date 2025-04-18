import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoginModule } from './login/login.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { CompaniesModule } from './companies/companies.module';
import { HealthModule } from './heatlth/health.module';
import { EasyPlayersModule } from './easyplayers/easyplayers.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { ServicesModule } from './modules/services/services.module';
import { TechniciansModule } from './modules/technicians/technicians.module';
import { SchedulingModule } from './modules/scheduling/scheduling.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        console.log('Registering soft delete plugin...');
        return {
          uri: configService.get<string>('MONGO_URL'),
          connectionFactory: (connection) => {
            connection.plugin(softDeletePlugin);
            console.log('Soft delete plugin registered');
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    LoginModule,
    CompaniesModule,
    HealthModule,
    EasyPlayersModule,
    AppointmentsModule,
    ContactsModule,
    VehiclesModule,
    ServicesModule,
    TechniciansModule,
    SchedulingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
