import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Availability,
  AvailabilityDocument,
} from './schemas/availability.schema';

import {
  AvailabilityOverride,
  AvailabilityOverrideDocument,
} from './schemas/availability-override.schema';

import { SlotsService } from '../slots/slots.service';
import { DoctorService } from '../doctor/doctor.service';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectModel(Availability.name)
    private readonly availabilityModel: Model<AvailabilityDocument>,

    @InjectModel(AvailabilityOverride.name)
    private readonly overrideModel: Model<AvailabilityOverrideDocument>,

    private readonly slotsService: SlotsService,
    private readonly doctorService: DoctorService,
  ) {}

  async create(data: any) {

    if (!data) {
      throw new BadRequestException(
        'Request body is missing',
      );
    }

    if (
      !['STREAM', 'WAVE'].includes(
        data.schedulingType,
      )
    ) {
      throw new BadRequestException(
        'Invalid scheduling type',
      );
    }

    if (data.startTime >= data.endTime) {
      throw new BadRequestException(
        'End time must be after start time',
      );
    }

    if (
      data.schedulingType === 'STREAM'
    ) {
      if (
        !data.slotDuration ||
        data.slotDuration <= 0
      ) {
        throw new BadRequestException(
          'Invalid slot duration',
        );
      }

      if (
        data.bufferTime !== undefined &&
        data.bufferTime < 0
      ) {
        throw new BadRequestException(
          'Invalid buffer time',
        );
      }
    }

    if (
      data.schedulingType === 'WAVE'
    ) {
      if (
        !data.capacity ||
        data.capacity <= 0
      ) {
        throw new BadRequestException(
          'Invalid capacity',
        );
      }
    }

    const overlap =
      await this.availabilityModel.findOne({
        doctorId: data.doctorId,
        dayOfWeek: data.dayOfWeek,
      });

    if (overlap) {
      throw new BadRequestException(
        'Time slot overlaps with existing slot',
      );
    }

    const availability =
      await this.availabilityModel.create(data);

    return {
      message:
        'Availability created successfully',
      data: availability,
    };
  }

  async findAll() {
    const data =
      await this.availabilityModel.find();

    return {
      message:
        'GET availability is working',
      data,
    };
  }

  async findOverrides() {
    return await this.overrideModel.find();
  }

  async update(id: string, data: any) {
    const availability =
      await this.availabilityModel.findByIdAndUpdate(
        id,
        data,
        { new: true },
      );

    if (!availability) {
      throw new NotFoundException(
        'Availability not found',
      );
    }

    return {
      message: 'Availability updated',
      data: availability,
    };
  }

  async remove(id: string) {
    const availability =
      await this.availabilityModel.findByIdAndDelete(
        id,
      );

    if (!availability) {
      throw new NotFoundException(
        'Availability not found',
      );
    }

    return {
      message: 'Availability deleted',
    };
  }

  async createOverride(data: any) {
    const override =
      await this.overrideModel.create(data);

    return {
      message:
        'Override created successfully',
      data: override,
    };
  }

  async getAvailabilityByDate(
    doctorId: number,
    date: string,
  ) {
    const override =
      await this.overrideModel.find({
        doctorId,
        date,
      });

    if (override.length > 0) {

      return override;
    }

    const dayOfWeek = new Date(date)
      .toLocaleDateString('en-US', {
        weekday: 'long',
      })
      .toUpperCase();

   

    const result =
      await this.availabilityModel.find({
        doctorId,
        dayOfWeek,
      });


    return result;
  }

async getNextAvailable(
  doctorId: number,
) {
  if (
    !doctorId ||
    isNaN(doctorId)
  ) {
    throw new BadRequestException(
      'Invalid doctor ID',
    );
  }

  await this.doctorService.findById(
    doctorId,
  );

  const today = new Date();

  let currentDate =
    new Date(today);

  let workingDaysChecked = 0;

  while (
    workingDaysChecked < 30
  ) {
    const date =
      currentDate
        .toISOString()
        .split('T')[0];

    const availability =
      await this.getAvailabilityByDate(
        doctorId,
        date,
      );

    const leaveOverride =
      await this.overrideModel.findOne({
        doctorId,
        date,
        startTime: '00:00',
        endTime: '00:00',
      });

    // Skip leave days
    if (leaveOverride) {
      currentDate.setDate(
        currentDate.getDate() + 1,
      );
      continue;
    }

    // Skip non-working days
    if (
      !availability ||
      availability.length === 0
    ) {
      currentDate.setDate(
        currentDate.getDate() + 1,
      );
      continue;
    }
    // Count only working days
    workingDaysChecked++;   
    const firstAvailability =
  availability[0] as any;

const schedulingType =
  firstAvailability.schedulingType;

if (
  schedulingType !== 'STREAM' &&
  schedulingType !== 'WAVE'
) {
  currentDate.setDate(
    currentDate.getDate() + 1,
  );
  continue;
}
    try {
      // Supports both STREAM and WAVE scheduling
      const slots =
        await this.slotsService.getDoctorSlots(
          doctorId,
          date,
          15,
        );

      if (
        slots &&
        slots.slots &&
        slots.slots.length > 0
      ) {
        return {
          success: true,
          message:
            'Next available appointment found',
          nextAvailableDate:
            date,
          totalSlots:
            slots.totalSlots,
          slots: slots.slots,
        };
      }
    } catch {
      // continue searching
    }

    currentDate.setDate(
      currentDate.getDate() + 1,
    );
  }

  throw new NotFoundException(
    'No appointments available in the next 30 working days. Please try again later.',
  );
}
}