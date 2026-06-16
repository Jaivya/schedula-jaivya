import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DoctorService } from '../doctor/doctor.service';
import { AvailabilityService } from '../availability/availability.service';
import { Appointment } from '../appointment/schemas/appointment.schema';
import { AppointmentStatus } from '../appointment/appointment-status.enum';

@Injectable()
export class SlotsService {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly availabilityService: AvailabilityService,
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<Appointment>,
  ) {}

  async getDoctorSlots(
    doctorId: number,
    date: string,
    duration: number,
  ) {
    console.log('DOCTOR ID:', doctorId);
    console.log('DATE:', date);
    console.log('DURATION:', duration);

    if (!date) {
      throw new BadRequestException(
        'Date is required',
      );
    }

    if (duration <= 0) {
      throw new BadRequestException(
        'Invalid duration',
      );
    }

    // Check doctor exists
    const doctor =
      this.doctorService.findById(doctorId);

    console.log('DOCTOR:', doctor);

    // Get availability / override
    const availability =
      await this.availabilityService.getAvailabilityByDate(
        doctorId,
        date,
      );

    console.log(
      'AVAILABILITY:',
      availability,
    );

    if (
      !availability ||
      availability.length === 0
    ) {
      throw new NotFoundException(
        'No availability found',
      );
    }

    const slots: any[] = [];

    // Fetch booked appointments for this doctor and date
    const bookedAppointments =
      await this.appointmentModel.find({
        doctorId,
        date,
        status: AppointmentStatus.BOOKED,
      });

    availability.forEach((slot: any) => {
      const start = this.toMinutes(
        slot.startTime,
      );

      const end = this.toMinutes(
        slot.endTime,
      );

      for (
        let current = start;
        current + duration <= end;
        current += duration
      ) {
        const slotStart = this.toTime(current);
        const slotEnd = this.toTime(
          current + duration,
        );

        const isBooked =
          bookedAppointments.some(
            (appt) =>
              appt.startTime === slotStart &&
              appt.endTime === slotEnd,
          );

        if (!isBooked) {
          slots.push({
            startTime: slotStart,
            endTime: slotEnd,
          });
        }
      }
    });

    return {
      doctorId,
      date,
      totalSlots: slots.length,
      slots,
    };
  }

  async isSlotInBaseAvailability(
    doctorId: number,
    date: string,
    startTime: string,
    endTime: string,
  ): Promise<boolean> {
    const availability =
      await this.availabilityService.getAvailabilityByDate(
        doctorId,
        date,
      );

    if (
      !availability ||
      availability.length === 0
    ) {
      return false;
    }

    const slotStart =
      this.toMinutes(startTime);
    const slotEnd =
      this.toMinutes(endTime);

    return availability.some(
      (window: any) => {
        const winStart =
          this.toMinutes(
            window.startTime,
          );

        const winEnd =
          this.toMinutes(
            window.endTime,
          );

        return (
          slotStart >= winStart &&
          slotEnd <= winEnd
        );
      },
    );
  }

  private toMinutes(time: string) {
    const [h, m] = time
      .split(':')
      .map(Number);

    return h * 60 + m;
  }

  private toTime(minutes: number) {
    const h = Math.floor(minutes / 60)
      .toString()
      .padStart(2, '0');

    const m = (minutes % 60)
      .toString()
      .padStart(2, '0');

    return `${h}:${m}`;
  }
}