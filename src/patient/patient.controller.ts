import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

import { PatientService } from './patient.service';
import { CreatePatientProfileDto } from './dto/create-patient-profile.dto';

@Controller('patient')
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
  ) {}

  @Post('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PATIENT')
  createProfile(
    @Body() body: CreatePatientProfileDto,
  ) {
    return this.patientService.create(body);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PATIENT')
  getProfile() {
    return this.patientService.findOne();
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PATIENT')
  updateProfile(
    @Body()
    body: Partial<CreatePatientProfileDto>,
  ) {
    return this.patientService.update(body);
  }
}