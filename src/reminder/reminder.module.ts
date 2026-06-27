import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ReminderService } from './reminder.service';

import {
  Appointment,
  AppointmentSchema,
} from '../appointment/schemas/appointment.schema';

import { NotificationModule } from '../notification/notification.module';
import { DoctorModule } from '../doctor/doctor.module';

@Module({
  imports: [
    NotificationModule,
    DoctorModule,

    MongooseModule.forFeature([
      {
        name: Appointment.name,
        schema: AppointmentSchema,
      },
    ]),
  ],
  providers: [ReminderService],
})
export class ReminderModule {}