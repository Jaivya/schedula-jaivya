import { Injectable } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  signup(signupDto: SignupDto) {
    const existingUser = this.usersService.findByEmail(
      signupDto.email,
    );

    if (existingUser) {
      return {
        message: 'User already exists',
      };
    }

    const user = {
      id: Date.now(),
      email: signupDto.email,
      password: signupDto.password,
      role: signupDto.role as Role,
    };

    this.usersService.create(user);

    return {
      message: 'User registered successfully',
      user,
    };
  }

  login(loginDto: LoginDto) {
    const user = this.usersService.findByEmail(
      loginDto.email,
    );

    if (
      !user ||
      user.password !== loginDto.password
    ) {
      return {
        message: 'Invalid credentials',
      };
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      message: 'Login successful',
      access_token:
        this.jwtService.sign(payload),
    };
  }

  getUsers() {
    return this.usersService.findAll();
  }
}