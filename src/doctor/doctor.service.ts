import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class DoctorService {
  private doctorProfiles = new Map<number, any>();

  private doctors = [
    {
      id: 1,
      fullName: 'Rahul Sharma',
      specialization: 'Cardiologist',
      experience: 10,
      consultationFee: 500,
      availability: true,
    },
    {
      id: 2,
      fullName: 'Priya Verma',
      specialization: 'Dermatologist',
      experience: 7,
      consultationFee: 700,
      availability: true,
    },
    {
      id: 3,
      fullName: 'Amit Singh',
      specialization: 'Neurologist',
      experience: 12,
      consultationFee: 1000,
      availability: false,
    },
    {
      id: 4,
      fullName: 'Rahul Gupta',
      specialization: 'Cardiologist',
      experience: 5,
      consultationFee: 400,
      availability: true,
    },
  ];

  create(userId: number, profile: any) {
    if (this.doctorProfiles.has(userId)) {
      return {
        message: 'Doctor profile already exists',
      };
    }

    this.doctorProfiles.set(userId, profile);

    return {
      message: 'Doctor Profile Created',
      data: profile,
    };
  }

  findOne(userId: number) {
    const profile = this.doctorProfiles.get(userId);
    if (!profile) {
      return {
        message: 'Doctor profile not found',
      };
    }

    return profile;
  }

  update(userId: number, profile: any) {
    const existing = this.doctorProfiles.get(userId);
    if (!existing) {
      return {
        message: 'Doctor profile not found',
      };
    }

    const updated = {
      ...existing,
      ...profile,
    };
    this.doctorProfiles.set(userId, updated);

    return {
      message: 'Doctor Profile Updated',
      data: updated,
    };
  }

  // Day 4 APIs

  findAll(
    specialization?: string,
    search?: string,
    page = 1,
    limit = 10,
    availability?: boolean,
  ) {
    if (page < 1 || limit < 1) {
      throw new BadRequestException(
        'Page and limit must be greater than 0',
      );
    }

    let result = [...this.doctors];

    if (specialization) {
      result = result.filter(
        (doctor) =>
          doctor.specialization.toLowerCase() ===
          specialization.toLowerCase(),
      );
    }

    if (search) {
      result = result.filter((doctor) =>
        doctor.fullName.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (availability !== undefined) {
      result = result.filter(
        (doctor) => doctor.availability === availability,
      );
    }

    const start = (page - 1) * limit;
    const end = start + limit;

    return result.slice(start, end);
  }

  findById(id: number) {

  const dynamicProfile = this.doctorProfiles.get(id);

  if (dynamicProfile) {
    return {
      id,
      ...dynamicProfile,
    };
  }

  const doctor = this.doctors.find((d) => d.id === id);

  if (!doctor) {
    throw new NotFoundException('Doctor not found');
  }

  return doctor;
}
}