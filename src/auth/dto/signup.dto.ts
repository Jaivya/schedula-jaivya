import { IsEmail, IsString, IsIn, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsIn(['DOCTOR', 'PATIENT'])
  role!: string;
}