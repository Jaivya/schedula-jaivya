import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { DoctorService } from '../doctor/doctor.service';
import { SlotsService } from '../slots/slots.service';
import { PatientService } from '../patient/patient.service';
import { UsersService } from '../users/users.service';

import { Appointment } from './schemas/appointment.schema';
import { AppointmentStatus } from './appointment-status.enum';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<Appointment>,
    private readonly doctorService: DoctorService,
    private readonly slotsService: SlotsService,
    private readonly patientService: PatientService,
    private readonly usersService: UsersService,
  ) {}

  async bookAppointment(patientId: number, body: any) {
    const {
      doctorId,
      date,
      startTime,
      endTime,
    } = body;

    const docId = Number(doctorId);

    // 1. Doctor must exist
    this.doctorService.findById(docId);

    // 2. Appointment must be in the future
    const appointmentDateTime = new Date(
      `${date}T${startTime}:00`,
    );

    if (appointmentDateTime <= new Date()) {
      throw new BadRequestException(
        'Appointment must be booked for a future date and time',
      );
    }

    // 3. Slot must exist in base availability
    const slotExists =
      this.slotsService.isSlotInBaseAvailability(
        docId,
        date,
        startTime,
        endTime,
      );

    if (!slotExists) {
      throw new BadRequestException(
        'Invalid slot',
      );
    }

    // 4. Same slot cannot be booked twice (must be available)
    const alreadyBooked =
      await this.appointmentModel.findOne({
        doctorId: docId,
        date,
        startTime,
        endTime,
        status: AppointmentStatus.BOOKED,
      });

    if (alreadyBooked) {
      throw new BadRequestException(
        'Slot already booked',
      );
    }

    // 5. Create and save appointment in MongoDB
    const appointment = new this.appointmentModel({
      doctorId: docId,
      patientId,
      date,
      startTime,
      endTime,
      status: AppointmentStatus.BOOKED,
    });

    const saved = await appointment.save();

    return {
      success: true,
      message: 'Appointment booked successfully',
      data: saved,
    };
  }

  async getPatientAppointments(patientId: number) {
    const appointments = await this.appointmentModel
      .find({ patientId })
      .exec();

    if (!appointments || appointments.length === 0) {
      throw new NotFoundException(
        'No appointments found',
      );
    }

    const data = appointments.map((appt) => {
      let doctorDetails: any = null;
      try {
        doctorDetails = this.doctorService.findById(appt.doctorId);
      } catch (error) {
        // ignore
      }

      return {
        id: appt._id.toString(),
        doctorId: appt.doctorId,
        patientId: appt.patientId,
        date: appt.date,
        startTime: appt.startTime,
        endTime: appt.endTime,
        status: appt.status,
        doctorDetails,
      };
    });

    return {
      success: true,
      message: 'Appointments retrieved successfully',
      data,
    };
  }

  async getDoctorAppointments(doctorId: number) {
    const appointments = await this.appointmentModel
      .find({ doctorId })
      .exec();

    if (!appointments || appointments.length === 0) {
      throw new NotFoundException(
        'No appointments found',
      );
    }

    const data = appointments.map((appt) => {
      let patientDetails: any = null;
      try {
        patientDetails = this.patientService.findById(appt.patientId);
      } catch (error) {
        // Fallback to user details if profile not created
        const user = this.usersService.findById(appt.patientId);
        if (user) {
          patientDetails = {
            id: user.id,
            fullName: user.email.split('@')[0],
            contactDetails: user.email,
          };
        }
      }

      return {
        id: appt._id.toString(),
        doctorId: appt.doctorId,
        patientId: appt.patientId,
        date: appt.date,
        startTime: appt.startTime,
        endTime: appt.endTime,
        status: appt.status,
        patientDetails,
      };
    });

    return {
      success: true,
      message: 'Appointments retrieved successfully',
      data,
    };
  }

  async cancelAppointment(patientId: number, id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(
        'Invalid appointment ID',
      );
    }

    const appointment = await this.appointmentModel.findById(id);

    if (!appointment) {
      throw new NotFoundException(
        'Appointment not found',
      );
    }

    // Only appointment owner (patient) can cancel
    if (appointment.patientId !== patientId) {
      throw new ForbiddenException(
        'Only the appointment owner can cancel this appointment',
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

    const appointmentDateTime = new Date(
      `${appointment.date}T${appointment.startTime}:00`,
    );

    if (appointmentDateTime < new Date()) {
      throw new BadRequestException(
        'Past appointment cannot be cancelled',
      );
    }

    appointment.status =
      AppointmentStatus.CANCELLED;

    const saved = await appointment.save();

    return {
      success: true,
      message: 'Appointment cancelled successfully',
      data: saved,
    };
  }
}