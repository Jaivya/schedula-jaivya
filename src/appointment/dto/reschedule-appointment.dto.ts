import {
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';

export class RescheduleAppointmentDto {
  @IsNumber()
  doctorId!: number;

  @IsString()
  date!: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsString()
  schedulingType!: string;
}