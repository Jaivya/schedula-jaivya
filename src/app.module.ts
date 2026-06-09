import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { DoctorController } from './doctor/doctor.controller';
import { DoctorService } from './doctor/doctor.service';
import { Doctor } from './doctor/entities/doctor.entity';

import { PatientController } from './patient/patient.controller';
import { PatientService } from './patient/patient.service';
import { Patient } from './patient/entities/patient.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'jaivya0323',
      database: 'schedula',

      entities: [Doctor, Patient],

      synchronize: false,
      autoLoadEntities: true,
    }),

    AuthModule,
    UsersModule,
  ],

  controllers: [
    AppController,
    DoctorController,
    PatientController,
  ],

  providers: [
    AppService,
    DoctorService,
    PatientService,
  ],
})
export class AppModule {}