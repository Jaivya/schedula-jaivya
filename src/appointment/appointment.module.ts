import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import {
  Appointment,
  AppointmentSchema,
} from './schemas/appointment.schema';

import { SlotsModule } from '../slots/slots.module';
import { DoctorModule } from '../doctor/doctor.module';
import { PatientModule } from '../patient/patient.module';
import { UsersModule } from '../users/users.module';
import { AvailabilityModule } from '../availability/availability.module';

@Module({
  imports: [
    SlotsModule,
    DoctorModule,
    PatientModule,
    UsersModule,
    AvailabilityModule,

    MongooseModule.forFeature([
      {
        name: Appointment.name,
        schema: AppointmentSchema,
      },
    ]),
  ],
  controllers: [
    AppointmentController,
  ],
  providers: [
    AppointmentService,
  ],
  exports: [
    AppointmentService,
  ],
})
export class AppointmentModule {}