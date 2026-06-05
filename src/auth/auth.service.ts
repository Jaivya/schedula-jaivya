import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  signup(signupDto: SignupDto) {
    const user = {
      id: Date.now(),
      ...signupDto,
    };

    this.usersService.create(user);
    return {
      message: 'User registered successfully',
      user,
    };
  }

  login(loginDto: LoginDto) {
    const user = this.usersService.findByEmail(loginDto.email);

    if (!user || user.password !== loginDto.password) {
      return {
        message: 'Invalid credentials',
      };
    }

    return {
      message: 'Login successful',
      user,
    };
  }
}