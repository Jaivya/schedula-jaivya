import { Injectable } from '@nestjs/common';

@Injectable()
export class PatientService {
  private patientProfile: any = {};

  create(profile: any) {
    this.patientProfile = profile;

    return {
      message: 'Patient Profile Created',
      data: profile,
    };
  }

  findOne() {
    return this.patientProfile;
  }

  update(profile: any) {
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