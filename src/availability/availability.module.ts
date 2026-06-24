import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';

import {
  Availability,
  AvailabilitySchema,
} from './schemas/availability.schema';

import {
  AvailabilityOverride,
  AvailabilityOverrideSchema,
} from './schemas/availability-override.schema';

import { SlotsModule } from '../slots/slots.module';
import { DoctorModule } from '../doctor/doctor.module';

@Module({
  imports: [
    forwardRef(() => SlotsModule),

    DoctorModule,

    MongooseModule.forFeature([
      {
        name: Availability.name,
        schema: AvailabilitySchema,
      },
      {
        name: AvailabilityOverride.name,
        schema: AvailabilityOverrideSchema,
      },
    ]),
  ],

  controllers: [AvailabilityController],

  providers: [AvailabilityService],

  exports: [AvailabilityService],
})
export class AvailabilityModule {}