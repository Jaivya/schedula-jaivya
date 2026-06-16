import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';

import { AppointmentService } from './appointment.service';
import { BookAppointmentDto } from './dto/book-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller()
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
  ) {}

  @Post('appointment')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PATIENT')
  bookAppointment(
    @Request() req: any,
    @Body() body: BookAppointmentDto,
  ) {
    return this.appointmentService.bookAppointment(
      req.user.userId,
      body,
    );
  }

  @Get('appointment/my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PATIENT')
  getPatientAppointments(@Request() req: any) {
    return this.appointmentService.getPatientAppointments(
      req.user.userId,
    );
  }

  @Get('doctor/appointments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('DOCTOR')
  getDoctorAppointments() {
    return this.appointmentService.getDoctorAppointments(1);
  }

  @Patch('appointment/:id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PATIENT')
  cancelAppointment(
    @Request() req: any,
    @Param('id') id: string,
  ) {
    return this.appointmentService.cancelAppointment(
      req.user.userId,
      id,
    );
  }
}