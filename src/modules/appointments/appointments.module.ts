import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Appointment, AppointmentSchema } from './schemas/appointment.schema';

// Add debug logging
const logger = new Logger('AppointmentsModule');
logger.debug('Registering Appointments module');

@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: Appointment.name, 
        schema: AppointmentSchema,
        collection: 'appointments'
      },
    ]),
  ],
  controllers: [AppointmentsController],
  providers: [
    {
      provide: 'APPOINTMENTS_DEBUG',
      useValue: true,
    },
    AppointmentsService
  ],
  exports: [AppointmentsService],
})
export class AppointmentsModule {
  constructor() {
    logger.debug('AppointmentsModule initialized');
  }
} 