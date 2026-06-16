import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AvailabilityDocument =
  Availability & Document;

@Schema()
export class Availability {
  @Prop({ required: true })
  doctorId!: number;

  @Prop({ required: true })
  dayOfWeek!: string;

  @Prop({ required: true })
  startTime!: string;

  @Prop({ required: true })
  endTime!: string;

  @Prop({
    required: true,
    enum: ['STREAM', 'WAVE'],
  })
  schedulingType!: string;

  @Prop()
  slotDuration?: number;

  @Prop({
    default: 0,
  })
  bufferTime?: number;

  @Prop()
  capacity?: number;
}

export const AvailabilitySchema =
  SchemaFactory.createForClass(
    Availability,
  );