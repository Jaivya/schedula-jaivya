import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';

import { SlotsService } from './slots.service';

@Controller('doctor')
export class SlotsController {
  constructor(
    private readonly slotsService: SlotsService,
  ) {}

  @Get(':doctorId/slots')
  getDoctorSlots(
    @Param('doctorId') doctorId: string,
    @Query('date') date: string,
    @Query('duration') duration: string,
  ) {
    return this.slotsService.getDoctorSlots(
      Number(doctorId),
      date,
      Number(duration || 15),
    );
  }
}