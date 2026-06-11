import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class AvailabilityService {
  private availabilities: any[] = [];
  private overrides: any[] = [];

  create(data: any) {
    // Invalid time validation
    if (data.startTime >= data.endTime) {
      throw new BadRequestException(
        'End time must be after start time',
      );
    }

    // Overlap validation
    const overlap = this.availabilities.find(
      (slot) =>
        slot.dayOfWeek === data.dayOfWeek &&
        data.startTime < slot.endTime &&
        data.endTime > slot.startTime,
    );

    if (overlap) {
      throw new BadRequestException(
        'Time slot overlaps with existing slot',
      );
    }

    const availability = {
      id: Date.now(),
      ...data,
    };

    this.availabilities.push(availability);

    return {
      message: 'Availability created successfully',
      data: availability,
    };
  }

  findAll() {
    return {
      message: 'GET availability is working',
      data: this.availabilities,
    };
  }

  update(id: number, data: any) {
    const availability = this.availabilities.find(
      (slot) => slot.id === id,
    );

    if (!availability) {
      throw new NotFoundException(
        'Availability not found',
      );
    }

    Object.assign(availability, data);

    return {
      message: 'Availability updated',
      data: availability,
    };
  }

  remove(id: number) {
    const index = this.availabilities.findIndex(
      (slot) => slot.id === id,
    );

    if (index === -1) {
      throw new NotFoundException(
        'Availability not found',
      );
    }

    this.availabilities.splice(index, 1);

    return {
      message: 'Availability deleted',
    };
  }

  createOverride(data: any) {
    const override = {
      id: Date.now(),
      ...data,
    };

    this.overrides.push(override);

    return {
      message: 'Override created successfully',
      data: override,
    };
  }

  getAvailabilityByDate(date: string) {
    const override = this.overrides.filter(
      (o) => o.date === date,
    );

    if (override.length > 0) {
      return override;
    }

    return this.availabilities;
  }
}