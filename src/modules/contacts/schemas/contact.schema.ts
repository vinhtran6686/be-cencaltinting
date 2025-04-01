import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ 
  collection: 'contacts',
  timestamps: true 
})
export class Contact extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  additionalInformation: string;

  @Prop()
  notes: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact); 