import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AppointmentStatus } from '../appointment-status.enum';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret: any) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Appointment extends Document {
  @Prop({ required: true })
  doctorId!: number;

  @Prop({ required: true })
  patientId!: number;

  @Prop({ required: true })
  date!: string;

  @Prop()
  startTime?: string;

  @Prop()
  endTime?: string;

  @Prop({
    required: true,
    enum: ['STREAM', 'WAVE'],
  })
  schedulingType!: string;

  @Prop()
  tokenNumber?: number;

  @Prop({
    type: String,
    enum: AppointmentStatus,
    default: AppointmentStatus.BOOKED,
  })
  status!: AppointmentStatus;
}

export const AppointmentSchema =
  SchemaFactory.createForClass(
    Appointment,
  );