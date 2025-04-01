import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ _id: false })
class VehicleDetails {
  @Prop({ required: true })
  year: string;

  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true })
  vehicleType: string;

  @Prop({ default: false })
  isCustomEntry: boolean;
}

@Schema({ _id: false })
class AppointmentService {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  packageId: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], required: true })
  serviceIds: string[];

  @Prop({ required: true })
  estimatedTime: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  technicianId: string;

  @Prop({ required: true })
  startDate: string;

  @Prop({ required: true })
  startTime: string;

  @Prop({ type: Date })
  estimatedEndDate: Date;
}

const VehicleDetailsSchema = SchemaFactory.createForClass(VehicleDetails);
const AppointmentServiceSchema = SchemaFactory.createForClass(AppointmentService);

@Schema({ 
  collection: 'appointments',
  timestamps: true 
})
export class Appointment extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  contactId: string;

  @Prop({ type: VehicleDetailsSchema, required: true })
  vehicleDetails: VehicleDetails;

  @Prop({ type: [AppointmentServiceSchema], required: true })
  services: AppointmentService[];

  @Prop({ 
    required: true,
    enum: ['scheduled', 'in-progress', 'completed', 'canceled'],
    default: 'scheduled'
  })
  status: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;

  @Prop()
  notes: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment); 