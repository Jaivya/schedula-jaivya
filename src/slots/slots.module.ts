import { Module } from '@nestjs/common';

import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';

import { AvailabilityModule } from '../availability/availability.module';
import { DoctorService } from '../doctor/doctor.service';

@Module({
  imports: [AvailabilityModule],
  controllers: [SlotsController],
  providers: [
    SlotsService,
    DoctorService,
  ],
  exports: [SlotsService], // IMPORTANT
})
export class SlotsModule {}