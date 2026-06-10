import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

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
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,

      ssl: {
        rejectUnauthorized: false,
      },

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