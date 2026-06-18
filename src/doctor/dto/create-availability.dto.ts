import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

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
}