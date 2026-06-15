import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

import { DoctorModule } from './doctor/doctor.module';
import { Doctor } from './doctor/entities/doctor.entity';

import { PatientModule } from './patient/patient.module';
import { Patient } from './patient/entities/patient.entity';

import { AvailabilityModule } from './availability/availability.module';
import { Availability } from './availability/availability.entity';

import { SlotsModule } from './slots/slots.module';
import { AppointmentModule } from './appointment/appointment.module';

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

      entities: [
        Doctor,
        Patient,
        Availability,
      ],

      synchronize: false,
      autoLoadEntities: true,
    }),

    MongooseModule.forRootAsync({
      useFactory: async () => {
        let uri = process.env.MONGODB_URI;
        if (!uri) {
          try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongo = await MongoMemoryServer.create();
            uri = mongo.getUri();
            console.log(`[Database] Started in-memory MongoDB at: ${uri}`);
          } catch (error) {
            console.error('[Database] Failed to start mongodb-memory-server, using default URI', error);
            uri = 'mongodb://127.0.0.1:27017/appointments';
          }
        }
        return { uri };
      },
    }),

    AuthModule,
    UsersModule,
    DoctorModule,
    PatientModule,
    AvailabilityModule,
    SlotsModule,
    AppointmentModule,
  ],

  controllers: [
    AppController,
  ],

  providers: [
    AppService,
  ],
})
export class AppModule {}