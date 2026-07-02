import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

import { DoctorModule } from '../doctor/doctor.module';
import { PatientModule } from '../patient/patient.module';

@Module({
  imports: [
    UsersModule,
    DoctorModule,
    PatientModule,
    PassportModule,
    JwtModule.register({
      secret: 'mySecretKey',
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}