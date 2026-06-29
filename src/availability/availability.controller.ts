import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Request,
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
  create(
    @Request() req: any,
    @Body() body: any,
  ) {
    body.doctorId = req.user.userId;

    return this.availabilityService.create(body);
  }

  @Get()
  findAll() {
    return this.availabilityService.findAll();
  }

  @Get('overrides')
  findOverrides() {
    return this.availabilityService.findOverrides();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.availabilityService.update(
      id,
      body,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.availabilityService.remove(
      id,
    );
  }

  @Post('override')
  createOverride(
    @Body() body: any,
  ) {
    return this.availabilityService.createOverride(
      body,
    );
  }

  @Get(':doctorId/date/:date')
  getAvailabilityByDate(
    @Param('doctorId') doctorId: string,
    @Param('date') date: string,
  ) {
    return this.availabilityService.getAvailabilityByDate(
      Number(doctorId),
      date,
    );
  }

  @Get(':doctorId/next-available')
  getNextAvailable(
    @Param('doctorId') doctorId: string,
  ) {
    return this.availabilityService.getNextAvailable(
      Number(doctorId),
    );
  }
}