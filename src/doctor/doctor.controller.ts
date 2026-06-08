import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

import { DoctorService } from './doctor.service';
import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  createProfile(@Body() body: CreateDoctorProfileDto) {
    return this.doctorService.create(body);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  getProfile() {
    return this.doctorService.findOne();
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  updateProfile(@Body() body: Partial<CreateDoctorProfileDto>) {
    return this.doctorService.update(body);
  }
}