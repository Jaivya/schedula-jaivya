import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AvailabilityOverrideDocument =
  AvailabilityOverride & Document;

@Schema()
export class AvailabilityOverride {
  @Prop({ required: true })
  doctorId!: number;

  @Prop({ required: true })
  date!: string;

  @Prop({ required: true })
  startTime!: string;

  @Prop({ required: true })
  endTime!: string;
}

export const AvailabilityOverrideSchema =
  SchemaFactory.createForClass(
    AvailabilityOverride,
  );