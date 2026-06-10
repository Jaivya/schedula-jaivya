import { Injectable } from '@nestjs/common';

@Injectable()
export class PatientService {
  private patientProfile: any = {};

  create(profile: any) {
    if (Object.keys(this.patientProfile).length > 0) {
      return {
        message: 'Patient profile already exists',
      };
    }

    this.patientProfile = profile;

    return {
      message: 'Patient Profile Created',
      data: profile,
    };
  }

  findOne() {
    if (Object.keys(this.patientProfile).length === 0) {
      return {
        message: 'Patient profile not found',
      };
    }

    return this.patientProfile;
  }

  update(profile: any) {
    if (Object.keys(this.patientProfile).length === 0) {
      return {
        message: 'Patient profile not found',
      };
    }

    this.patientProfile = {
      ...this.patientProfile,
      ...profile,
    };

    return {
      message: 'Patient Profile Updated',
      data: this.patientProfile,
    };
  }
}