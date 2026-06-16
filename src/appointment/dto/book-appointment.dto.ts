import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  IsIn,
} from 'class-validator';

export class BookAppointmentDto {
  @IsNotEmpty()
  @IsNumber()
  doctorId!: number;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'date must be in YYYY-MM-DD format',
  })
  date!: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, {
    message: 'startTime must be in HH:MM format',
  })
  startTime!: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, {
    message: 'endTime must be in HH:MM format',
  })
  endTime!: string;

  @IsString()
  @IsIn(['STREAM', 'WAVE'])
  schedulingType!: string;
}