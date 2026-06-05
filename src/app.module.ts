import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { DoctorController } from './doctor/doctor.controller';
import { PatientController } from './patient/patient.controller';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [
    AppController,
    DoctorController,
    PatientController,
  ],
  providers: [AppService],
})
export class AppModule {}