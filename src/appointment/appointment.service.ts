import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DoctorService } from '../doctor/doctor.service';
import { SlotsService } from '../slots/slots.service';

import { AppointmentStatus } from './appointment-status.enum';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly slotsService: SlotsService,
  ) {}

  private appointments: any[] = [];

  bookAppointment(body: any) {
    const {
      doctorId,
      date,
      startTime,
      endTime,
    } = body;

    // Future appointment validation
    const appointmentDateTime = new Date(
      `${date}T${startTime}:00`,
    );

    if (appointmentDateTime <= new Date()) {
      throw new BadRequestException(
        'Appointment must be booked for a future date and time',
      );
    }

    // Check doctor exists
    this.doctorService.findById(doctorId);

    // Generate slots from Day 7 API
    const slots =
      this.slotsService.getDoctorSlots(
        doctorId,
        date,
        15,
      );

    // Check requested slot exists
    const slotExists = slots.slots.find(
      (slot) =>
        slot.startTime === startTime &&
        slot.endTime === endTime,
    );

    if (!slotExists) {
      throw new BadRequestException(
        'Invalid slot',
      );
    }

    // Prevent duplicate booking
    const alreadyBooked =
      this.appointments.find(
        (appointment) =>
          appointment.doctorId === doctorId &&
          appointment.date === date &&
          appointment.startTime ===
            startTime &&
          appointment.status ===
            AppointmentStatus.BOOKED,
      );

    if (alreadyBooked) {
      throw new BadRequestException(
        'Slot already booked',
      );
    }

    const appointment = {
      id: Date.now(),
      doctorId,
      patientId: 1,
      date,
      startTime,
      endTime,
      status:
        AppointmentStatus.BOOKED,
    };

    this.appointments.push(
      appointment,
    );

    return {
      message:
        'Appointment booked successfully',
      data: appointment,
    };
  }

  getPatientAppointments() {
    return this.appointments.filter(
      (appointment) =>
        appointment.patientId === 1,
    );
  }

  getDoctorAppointments(
    doctorId: number,
  ) {
    return this.appointments.filter(
      (appointment) =>
        appointment.doctorId === doctorId,
    );
  }

  cancelAppointment(id: number) {
    const appointment =
      this.appointments.find(
        (appointment) =>
          appointment.id === id,
      );

    if (!appointment) {
      throw new NotFoundException(
        'Appointment not found',
      );
    }

    if (
      appointment.status ===
      AppointmentStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Appointment already cancelled',
      );
    }

    appointment.status =
      AppointmentStatus.CANCELLED;

    return {
      message:
        'Appointment cancelled successfully',
      data: appointment,
    };
  }
}