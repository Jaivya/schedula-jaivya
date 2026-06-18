import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';
import { DoctorModule } from '../doctor/doctor.module';
import { AvailabilityModule } from '../availability/availability.module';
import { Appointment, AppointmentSchema } from '../appointment/schemas/appointment.schema';

@Module({
  imports: [
    AvailabilityModule,
    DoctorModule,
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
  ],
  controllers: [SlotsController],
  providers: [SlotsService],
  exports: [SlotsService],
})
export class SlotsModule {}