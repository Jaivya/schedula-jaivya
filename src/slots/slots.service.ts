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

    await this.doctorService.findById(
      doctorId,
    );

    const availability =
      await this.availabilityService.getAvailabilityByDate(
        doctorId,
        date,
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

    const bookedAppointments =
      await this.appointmentModel.find({
        doctorId,
        date,
        status:
          AppointmentStatus.BOOKED,
      });

    console.log('====================');
    console.log(
      'BOOKED APPOINTMENTS',
    );
    console.log(bookedAppointments);
    console.log(
      'COUNT:',
      bookedAppointments.length,
    );
    console.log('====================');

    availability.forEach(
      (slot: any) => {
        const start =
          this.toMinutes(
            slot.startTime,
          );

        const end =
          this.toMinutes(
            slot.endTime,
          );

        const schedulingType =
          slot.schedulingType ||
          'STREAM';

        // STREAM
        if (
          schedulingType ===
          'STREAM'
        ) {
          const slotDuration =
            slot.slotDuration ||
            duration;

          const buffer =
            slot.bufferTime || 0;

          for (
            let current = start;
            current +
              slotDuration <=
            end;
            current +=
              slotDuration +
              buffer
          ) {
            const slotStart =
              this.toTime(
                current,
              );

            const slotEnd =
              this.toTime(
                current +
                  slotDuration,
              );

            const isBooked =
              bookedAppointments.some(
                (appt) =>
                  appt.startTime ===
                    slotStart &&
                  appt.endTime ===
                    slotEnd,
              );

            if (!isBooked) {
              slots.push({
                type: 'STREAM',
                startTime:
                  slotStart,
                endTime: slotEnd,
              });
            }
          }
        }

        // WAVE
        if (
          schedulingType ===
          'WAVE'
        ) {
          const capacity =
            slot.capacity || 0;

          const bookedCount =
            bookedAppointments.filter(
              (appt) =>
                appt.schedulingType ===
                'WAVE',
            ).length;

          slots.push({
            type: 'WAVE',
            window: `${slot.startTime}-${slot.endTime}`,
            capacity,
            available:
              capacity -
              bookedCount,
          });
        }
      },
    );

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
          slotStart >=
            winStart &&
          slotEnd <= winEnd
        );
      },
    );
  }

  private toMinutes(
    time: string,
  ): number {
    const [h, m] = time
      .split(':')
      .map(Number);

    return h * 60 + m;
  }

  private toTime(
    minutes: number,
  ): string {
    const h = Math.floor(
      minutes / 60,
    )
      .toString()
      .padStart(2, '0');

    const m = (
      minutes % 60
    )
      .toString()
      .padStart(2, '0');

    return `${h}:${m}`;
  }
}