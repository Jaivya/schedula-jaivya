import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { DoctorService } from '../doctor/doctor.service';
import { AvailabilityService } from '../availability/availability.service';

@Injectable()
export class SlotsService {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly availabilityService: AvailabilityService,
  ) {}

  getDoctorSlots(
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
      this.availabilityService.getAvailabilityByDate(
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
        slots.push({
          startTime: this.toTime(current),
          endTime: this.toTime(
            current + duration,
          ),
        });
      }
    });

    return {
      doctorId,
      date,
      totalSlots: slots.length,
      slots,
    };
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