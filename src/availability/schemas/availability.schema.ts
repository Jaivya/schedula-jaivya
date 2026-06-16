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
}

export const AvailabilitySchema =
  SchemaFactory.createForClass(
    Availability,
  );