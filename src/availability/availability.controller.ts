import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { AvailabilityService } from './availability.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('doctor/availability')
export class AvailabilityController {
  constructor(
    private readonly availabilityService: AvailabilityService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  create(@Body() body: any) {
    return this.availabilityService.create(body);
  }

  @Get()
  findAll() {
    return this.availabilityService.findAll();
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  update(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.availabilityService.update(
      Number(id),
      body,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  remove(@Param('id') id: string) {
    return this.availabilityService.remove(
      Number(id),
    );
  }

  @Post('override')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  createOverride(@Body() body: any) {
    return this.availabilityService.createOverride(
      body,
    );
  }

  @Get('date/:date')
  getAvailabilityByDate(
    @Param('date') date: string,
  ) {
    return this.availabilityService.getAvailabilityByDate(
      date,
    );
  }
}