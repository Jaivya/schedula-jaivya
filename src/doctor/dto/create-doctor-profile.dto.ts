import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDoctorProfileDto {
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  specialization!: string;  

  @IsNumber()
  experience!: number;

  @IsString()
  qualification!: string;

  @IsNumber()
  consultationFee!: number;

  @IsString()
  availability!: string;

  @IsString()
  profileDetails!: string;
}