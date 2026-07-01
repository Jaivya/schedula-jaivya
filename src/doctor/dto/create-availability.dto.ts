import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateAvailabilityDto {
  @IsNumber()
  doctorId!: number;

  @IsString()
  @IsNotEmpty()
  dayOfWeek!: string;

  @IsString()
  @IsNotEmpty()
  startTime!: string;

  @IsString()
  @IsNotEmpty()
  endTime!: string;

  @IsOptional()
  @IsBoolean()
  allowFutureBooking?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxFutureBookingDays?: number;
}