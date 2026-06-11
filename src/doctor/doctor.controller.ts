import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Query,
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

  // Day 3 Onboarding APIs

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

  // Day 4 Discovery APIs

  @Get()
  getDoctors(
    @Query('specialization') specialization?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('availability') availability?: string,
  ) {
    return this.doctorService.findAll(
      specialization,
      search,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
      availability === 'true'
        ? true
        : availability === 'false'
        ? false
        : undefined,
    );
  }

  @Get('details/:id')
  getDoctorById(@Param('id') id: string) {
    return this.doctorService.findById(Number(id));
  }
}