import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { AvailabilityService } from '../availability/availability.service';

import { DoctorService } from '../doctor/doctor.service';
import { SlotsService } from '../slots/slots.service';
import { PatientService } from '../patient/patient.service';
import { UsersService } from '../users/users.service';

import { Appointment } from './schemas/appointment.schema';
import { AppointmentStatus } from './appointment-status.enum';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<Appointment>,
    private readonly doctorService: DoctorService,
    private readonly slotsService: SlotsService,
    private readonly patientService: PatientService,
    private readonly usersService: UsersService,
    private readonly availabilityService: AvailabilityService,
  ) {}

  async bookAppointment(patientId: number, body: any) {
    const {
  doctorId,
  date,
  startTime,
  endTime,
  schedulingType,
} = body;
const docId = Number(doctorId);

// Doctor must exist
await this.doctorService.findById(
  docId,
);


if (schedulingType === 'WAVE') {
  const availability =
    await this.availabilityService.getAvailabilityByDate(
      docId,
      date,
    );

  const wave: any = availability.find(
  (slot: any) =>
    slot.schedulingType === 'WAVE',
);

  if (!wave) {
    throw new BadRequestException(
      'Wave not available',
    );
  }

  const bookedCount =
    await this.appointmentModel.countDocuments({
      doctorId: docId,
      date,
      schedulingType: 'WAVE',
      status: AppointmentStatus.BOOKED,
    });

  if (bookedCount >= wave.capacity) { 
    throw new BadRequestException(
      'Wave is full',
    );
  }

  const tokenNumber =
    bookedCount + 1;

  const appointment =
    await this.appointmentModel.create({
      doctorId: docId,
      patientId,
      date,
      schedulingType: 'WAVE',
      tokenNumber,
      startTime: wave.startTime,
      endTime: wave.endTime,
      status: AppointmentStatus.BOOKED,
    });

  return {
    success: true,
    message:
      'Wave appointment booked successfully',
    data: appointment,
  };
}

   

    // Appointment must be in future
    const appointmentDateTime = new Date(
      `${date}T${startTime}:00`,
    );

    if (appointmentDateTime <= new Date()) {
      throw new BadRequestException(
        'Appointment must be booked for a future date and time',
      );
    }

    // Slot must exist
    const slotExists =
      await this.slotsService.isSlotInBaseAvailability(
        docId,
        date,
        startTime,
        endTime,
      );

    if (!slotExists) {
      throw new BadRequestException(
        'Invalid slot',
      );
    }

    // Prevent duplicate booking
    const alreadyBooked =
      await this.appointmentModel.findOne({
        doctorId: docId,
        date,
        startTime,
        endTime,
        status: AppointmentStatus.BOOKED,
      });

    if (alreadyBooked) {
      throw new BadRequestException(
        'Slot already booked',
      );
    }

    const appointment = new this.appointmentModel({
  doctorId: docId,
  patientId,
  date,
  startTime,
  endTime,
  schedulingType,
  status: AppointmentStatus.BOOKED,
});

    const saved = await appointment.save();

    return {
      success: true,
      message: 'Appointment booked successfully',
      data: saved,
    };
  }

  async getPatientAppointments(patientId: number) {
    const appointments = await this.appointmentModel
      .find({ patientId })
      .exec();

    if (!appointments || appointments.length === 0) {
      throw new NotFoundException(
        'No appointments found',
      );
    }

    const data = appointments.map((appt) => {
      let doctorDetails: any = null;

      try {
        doctorDetails =
          this.doctorService.findById(
            appt.doctorId,
          );
      } catch (error) {}

      return {
  id: appt._id.toString(),
  doctorId: appt.doctorId,
  patientId: appt.patientId,
  date: appt.date,
  startTime: appt.startTime,
  endTime: appt.endTime,
  schedulingType: appt.schedulingType,
  tokenNumber: appt.tokenNumber,
  status: appt.status,
  doctorDetails,
};
    });

    return {
      success: true,
      message:
        'Appointments retrieved successfully',
      data,
    };
  }

  async getDoctorAppointments(
  doctorId: number,
  date?: string,
) {
  await this.doctorService.findById(
  doctorId,
);
if (
  date &&
  !/^\d{4}-\d{2}-\d{2}$/.test(date)
) {
  throw new BadRequestException(
    'Invalid date filter',
  );
}
     
const filter: any = {
  doctorId,
  status: AppointmentStatus.BOOKED,
};

if (date) {
  filter.date = date;
}

const appointments =
  await this.appointmentModel
    .find(filter)
    .exec();
    if (
      !appointments ||
      appointments.length === 0
    ) {
      throw new NotFoundException(
        'No appointments found',
      );
    } 
    const data = appointments.map((appt) => {
      let patientDetails: any = null;

      try {
        patientDetails =
          this.patientService.findById(
            appt.patientId,
          );
      } catch (error) {
        const user =
          this.usersService.findById(
            appt.patientId,
          );

        if (user) {
          patientDetails = {
            id: user.id,
            fullName:
              user.email.split('@')[0],
            contactDetails: user.email,
          };
        }
      }
return {
  id: appt._id.toString(),
  doctorId: appt.doctorId,
  patientId: appt.patientId,
  date: appt.date,
  startTime: appt.startTime,
  endTime: appt.endTime,
  schedulingType: appt.schedulingType,
  tokenNumber: appt.tokenNumber,
  status: appt.status,
  patientDetails,
};
    });

    return {
      success: true,
      message:
        'Appointments retrieved successfully',
      data,
    };
  }

  async cancelAppointment(
    patientId: number,
    id: string,
  ) {
    

    if (!isValidObjectId(id)) {
      throw new BadRequestException(
        'Invalid appointment ID',
      );
    }

    const appointment =
      await this.appointmentModel.findById(
        id,
      );

    if (!appointment) {
      throw new NotFoundException(
        'Appointment not found',
      );
    }

    if (
      appointment.patientId !== patientId
    ) {
      throw new ForbiddenException(
        'Only the appointment owner can cancel this appointment',
      );
    }

    if (
      appointment.status ===
      AppointmentStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Appointment already cancelled',
      );
    }

    const appointmentDateTime =
      new Date(
        `${appointment.date}T${appointment.startTime}:00`,
      );
      const diffMinutes =
  (appointmentDateTime.getTime() -
    new Date().getTime()) /
  (1000 * 60);

if (diffMinutes < 30) {
  throw new BadRequestException(
    'Cancel not allowed within 30 minutes of appointment',
  );
}

    if (
      appointmentDateTime < new Date()
    ) {
      throw new BadRequestException(
        'Past appointment cannot be cancelled',
      );
    }

    appointment.status =
      AppointmentStatus.CANCELLED;

    const saved =
      await appointment.save();

    return {
      success: true,
      message:
        'Appointment cancelled successfully',
      data: saved,
    };
  
  }
  async cancelDoctorAppointment(
  doctorId: number,
  id: string,
) {
  await this.doctorService.findById(
    doctorId,
  );
  if (!isValidObjectId(id)) {
    throw new BadRequestException(
      'Invalid appointment ID',
    );
  }

  const appointment =
    await this.appointmentModel.findById(id);

  if (!appointment) {
    throw new NotFoundException(
      'Appointment not found',
    );
  }

  if (
    appointment.doctorId !== doctorId
  ) {
    throw new ForbiddenException(
      'You can only cancel your own appointments',
    );
  }

  if (
    appointment.status ===
    AppointmentStatus.CANCELLED
  ) {
    throw new BadRequestException(
      'Appointment already cancelled',
    );
  }

  appointment.status =
    AppointmentStatus.CANCELLED;

  const saved =
    await appointment.save();

  return {
    success: true,
    message:
      'Appointment cancelled successfully',
    data: saved,
  };
}
  async rescheduleAppointment(
  patientId: number,
  appointmentId: string,
  body: any,
) {
  if (!isValidObjectId(appointmentId)) {
    throw new BadRequestException(
      'Invalid appointment ID',
    );
  }

  const appointment =
    await this.appointmentModel.findById(
      appointmentId,
    );

  if (!appointment) {
    throw new NotFoundException(
      'Appointment not found',
    );
  }


if (
  appointment.patientId !== patientId
) {
  throw new ForbiddenException(
    'Only appointment owner can reschedule',
  );
}

  if (
    appointment.status ===
    AppointmentStatus.CANCELLED
  ) {
    throw new BadRequestException(
      'Cancelled appointment cannot be rescheduled',
    );
  }

  const appointmentDateTime = new Date(
    `${appointment.date}T${appointment.startTime}:00`,
  );

  const diffMinutes =
    (appointmentDateTime.getTime() -
      new Date().getTime()) /
    (1000 * 60);

  if (diffMinutes < 30) {
    throw new BadRequestException(
      'Reschedule not allowed within 30 minutes of appointment',
    );
  }

  if (
    appointment.date === body.date &&
    appointment.startTime === body.startTime &&
    appointment.endTime === body.endTime
  ) {
    throw new BadRequestException(
      'Cannot reschedule to same slot',
    );
  }

  const newAppointmentDateTime = new Date(
    `${body.date}T${body.startTime}:00`,
  );

  if (
    newAppointmentDateTime <= new Date()
  ) {
    throw new BadRequestException(
      'Cannot reschedule to past date/time',
    );
  }

  if (
    body.schedulingType === 'STREAM'
  ) {
    const slotExists =
      await this.slotsService.isSlotInBaseAvailability(
        Number(body.doctorId),
        body.date,
        body.startTime,
        body.endTime,
      );

    if (!slotExists) {
  let availableSlots =
    await this.slotsService.getDoctorSlots(
      Number(body.doctorId),
      body.date,
      15,
    );

  let suggestedSlot =
    availableSlots.slots[0] || null;

  if (!suggestedSlot) {
    const nextDate = new Date(
      body.date,
    );

    nextDate.setDate(
      nextDate.getDate() + 1,
    );

    const nextDateString =
      nextDate
        .toISOString()
        .split('T')[0];

    try {
      const nextDaySlots =
        await this.slotsService.getDoctorSlots(
          Number(body.doctorId),
          nextDateString,
          15,
        );

      suggestedSlot =
        nextDaySlots.slots[0] || null;
    } catch (error) {}
  }
  throw new BadRequestException({
  success: false,
  message:
    'Requested slot unavailable',
  suggestedSlot,
});
}
}

    const alreadyBooked =
      await this.appointmentModel.findOne({
        doctorId: body.doctorId,
        date: body.date,
        startTime: body.startTime,
        endTime: body.endTime,
        status: AppointmentStatus.BOOKED,
      });

   if (
  alreadyBooked &&
  alreadyBooked._id.toString() !==
    appointmentId
) {
  const availableSlots =
    await this.slotsService.getDoctorSlots(
      Number(body.doctorId),
      body.date,
      15,
    );
throw new BadRequestException({
  success: false,
  message:
    'Requested slot already booked',
  suggestedSlot:
    availableSlots.slots[0] || null,
});
} 
  

  appointment.doctorId =
    Number(body.doctorId);

  appointment.date =
    body.date;

  appointment.startTime =
    body.startTime;

  appointment.endTime =
    body.endTime;

  appointment.schedulingType =
    body.schedulingType;

  const saved =
    await appointment.save();

  return {
    success: true,
    message:
      'Appointment rescheduled successfully',
    data: saved,
  };
}
}
