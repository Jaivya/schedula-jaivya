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

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectModel(Availability.name)
    private readonly availabilityModel: Model<AvailabilityDocument>,

    @InjectModel(AvailabilityOverride.name)
    private readonly overrideModel: Model<AvailabilityOverrideDocument>,
  ) {}

  async create(data: any) {
    console.log('BODY RECEIVED:', data);

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
      console.log(
        'OVERRIDE FOUND:',
        override,
      );

      return override;
    }

    const dayOfWeek = new Date(date)
      .toLocaleDateString('en-US', {
        weekday: 'long',
      })
      .toUpperCase();

    console.log('================');
    console.log('DATE:', date);
    console.log(
      'DAY OF WEEK:',
      dayOfWeek,
    );

    const result =
      await this.availabilityModel.find({
        doctorId,
        dayOfWeek,
      });

    console.log(
      'AVAILABILITY FOUND:',
      result,
    );
    console.log('================');

    return result;
  }
}