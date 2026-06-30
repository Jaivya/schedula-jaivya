import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Appointment } from '../appointment/schemas/appointment.schema';
import { AppointmentStatus } from '../appointment/appointment-status.enum';

import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/notification-type.enum';

import { DoctorService } from '../doctor/doctor.service';

@Injectable()
export class ReminderService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<Appointment>,

    private readonly notificationService: NotificationService,

    private readonly doctorService: DoctorService,
  ) {}

  @Cron('* * * * *')
  async sendAppointmentReminders() {
  
    const now = new Date();

    const oneHourLater = new Date(
      now.getTime() + 60 * 60 * 1000,
    );

    const appointments =
      await this.appointmentModel.find({
        status: AppointmentStatus.BOOKED,
        reminderSent: false,
      });

    for (const appointment of appointments) {
      try {
        if (!appointment.startTime) {
          continue;
        }

        const appointmentTime = new Date(
          `${appointment.date}T${appointment.startTime}:00`,
        );

        if (
          appointmentTime < now ||
          appointmentTime > oneHourLater
        ) {
          continue;
        }

        const doctor =
          this.doctorService.findById(
            appointment.doctorId,
          );

        if (
          appointment.schedulingType ===
          'STREAM'
        ) {
          await this.notificationService.createNotification(
            appointment.patientId.toString(),
            'Appointment Reminder',
            `Reminder: You have an appointment with Dr. ${doctor.fullName} today at ${appointment.startTime}.`,
            NotificationType.APPOINTMENT_REMINDER,
          );
        } else {
          await this.notificationService.createNotification(
            appointment.patientId.toString(),
            'Appointment Reminder',
            `Reminder: You have an appointment with Dr. ${doctor.fullName} today.\nReporting Time: ${appointment.startTime}\nToken Number: ${appointment.tokenNumber}`,
            NotificationType.APPOINTMENT_REMINDER,
          );
        }

        appointment.reminderSent = true;

        await appointment.save();

      } catch (error) {
        console.error(error);
      }
    }
  }
}