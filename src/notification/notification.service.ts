import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Notification } from './notification.entity';
import { NotificationType } from './notification-type.enum';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

 async createNotification(
  patientId: string,
  title: string,
  message: string,
  type: NotificationType,
) {
  console.log('NOTIFICATION SERVICE HIT');
  console.log('PATIENT ID:', patientId);

  const notification =
    this.notificationRepository.create({
      patientId,
      title,
      message,
      type,
      isRead: false,
    });

  console.log('BEFORE SAVE');

  const saved =
    await this.notificationRepository.save(
      notification,
    );

  console.log('AFTER SAVE');
  console.log(saved);

  return saved;
}

  async findAll(
    patientId: string,
  ) {
    const notifications =
      await this.notificationRepository.find({
        where: { patientId },
        order: {
          createdAt: 'DESC',
        },
      });

    return {
      message:
        'Notifications fetched successfully',
      data: notifications,
    };
  }

  async markAsRead(
    id: number,
    patientId: string,
  ) {
    const notification =
      await this.notificationRepository.findOne({
        where: {
          id,
          patientId,
        },
      });

    if (!notification) {
      throw new NotFoundException(
        'Notification not found',
      );
    }

    if (notification.isRead) {
      return {
        message:
          'Notification already marked as read',
        data: notification,
      };
    }

    notification.isRead = true;

    await this.notificationRepository.save(
      notification,
    );

    return {
      message:
        'Notification marked as read',
      data: notification,
    };
  }

  async markAllAsRead(
    patientId: string,
  ) {
    await this.notificationRepository.update(
      {
        patientId,
        isRead: false,
      },
      {
        isRead: true,
      },
    );

    return {
      message:
        'All notifications marked as read',
    };
  }

  async getUnreadCount(
    patientId: string,
  ) {
    const count =
      await this.notificationRepository.count({
        where: {
          patientId,
          isRead: false,
        },
      });

    return {
      unreadCount: count,
    };
  }
}