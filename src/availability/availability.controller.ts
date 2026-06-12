import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

import { AvailabilityService } from './availability.service';

@Controller('doctor/availability')
export class AvailabilityController {
  constructor(
    private readonly availabilityService: AvailabilityService,
  ) {}

  @Post()
  create(@Body() body: any) {
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
      Number(id),
      body,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.availabilityService.remove(
      Number(id),
    );
  }

  @Post('override')
  createOverride(@Body() body: any) {
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
}