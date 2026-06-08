import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePatientProfileDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsNumber()
  age!: number;

  @IsString()
  gender!: string;

  @IsString()
  contactDetails!: string;

  @IsOptional()
  @IsString()
  healthInfo?: string;
}