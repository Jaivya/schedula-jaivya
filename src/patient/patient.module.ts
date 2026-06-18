import { Module } from '@nestjs/common';

import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';

import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}