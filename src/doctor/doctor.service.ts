import { Injectable } from '@nestjs/common';

@Injectable()
export class DoctorService {
  private doctorProfile: any = {};

  create(profile: any) {
    if (Object.keys(this.doctorProfile).length > 0) {
      return {
        message: 'Doctor profile already exists',
      };
    }

    this.doctorProfile = profile;

    return {
      message: 'Doctor Profile Created',
      data: profile,
    };
  }

  findOne() {
    if (Object.keys(this.doctorProfile).length === 0) {
      return {
        message: 'Doctor profile not found',
      };
    }

    return this.doctorProfile;
  }

  update(profile: any) {
    if (Object.keys(this.doctorProfile).length === 0) {
      return {
        message: 'Doctor profile not found',
      };
    }

    this.doctorProfile = {
      ...this.doctorProfile,
      ...profile,
    };

    return {
      message: 'Doctor Profile Updated',
      data: this.doctorProfile,
    };
  }
}