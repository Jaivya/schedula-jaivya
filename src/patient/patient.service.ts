import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class PatientService {
  constructor(private readonly usersService: UsersService) {}

  private patientProfiles = new Map<number, any>();

  create(userId: number, profile: any) {
    if (this.patientProfiles.has(userId)) {
      return {
        message: 'Patient profile already exists',
      };
    }

    this.patientProfiles.set(userId, profile);

    return {
      message: 'Patient Profile Created',
      data: profile,
    };
  }

  findOne(userId: number) {
    const profile = this.patientProfiles.get(userId);
    if (!profile) {
      return {
        message: 'Patient profile not found',
      };
    }

    return profile;
  }

  update(userId: number, profile: any) {
    const existing = this.patientProfiles.get(userId);
    if (!existing) {
      return {
        message: 'Patient profile not found',
      };
    }

    const updated = {
      ...existing,
      ...profile,
    };
    this.patientProfiles.set(userId, updated);

    return {
      message: 'Patient Profile Updated',
      data: updated,
    };
  }

  findById(id: number) {
    const patientProfile = this.patientProfiles.get(id);
    if (patientProfile) {
      return {
        id,
        ...patientProfile,
      };
    }

    // Fallback to user details if profile not created yet
    const user = this.usersService.findById(id);
    if (user && user.role === 'PATIENT') {
      return {
        id: user.id,
        fullName: user.email.split('@')[0],
        contactDetails: user.email,
      };
    }

    throw new NotFoundException('Patient not found');
  }
}