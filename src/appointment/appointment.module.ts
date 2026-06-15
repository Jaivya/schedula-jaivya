import { Module } from '@nestjs/common';

import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';

import { SlotsModule } from '../slots/slots.module';
import { DoctorService } from '../doctor/doctor.service';

@Module({
  imports: [SlotsModule],
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    DoctorService,
  ],
})
export class AppointmentModule {}