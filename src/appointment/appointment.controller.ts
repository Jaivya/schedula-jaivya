import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
} from '@nestjs/common';

import { AppointmentService } from './appointment.service';

@Controller()
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
  ) {}

  @Post('appointment')
  bookAppointment(@Body() body: any) {
    return this.appointmentService.bookAppointment(
      body,
    );
  }

  @Get('appointment/my')
  getPatientAppointments() {
    return this.appointmentService.getPatientAppointments();
  }

  @Get('doctor/appointments')
  getDoctorAppointments() {
    return this.appointmentService.getDoctorAppointments(
      1,
    );
  }

  @Patch('appointment/:id/cancel')
  cancelAppointment(
    @Param('id') id: string,
  ) {
    return this.appointmentService.cancelAppointment(
      Number(id),
    );
  }
}