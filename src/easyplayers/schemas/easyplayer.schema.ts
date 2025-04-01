import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EasyPlayerDocument = EasyPlayer & Document;

@Schema({ timestamps: true })
export class EasyPlayer {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: 0 })
  score: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;
}

export const EasyPlayerSchema = SchemaFactory.createForClass(EasyPlayer); 