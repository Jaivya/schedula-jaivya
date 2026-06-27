import {
  Controller,
  Get,
  Patch,
  Param,
  Req,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  @Get()
  getNotifications(@Req() req: any) {
    console.log(
      'CONTROLLER USER ID:',
      req.user.userId,
    );

    return this.notificationService.findAll(
      req.user.userId.toString(),
    );
  }

  @Patch(':id/read')
  markAsRead(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    return this.notificationService.markAsRead(
      id,
      req.user.userId.toString(),
    );
  }

  @Patch('read-all')
  markAllAsRead(@Req() req: any) {
    return this.notificationService.markAllAsRead(
      req.user.userId.toString(),
    );
  }

  @Get('unread-count')
  getUnreadCount(@Req() req: any) {
    return this.notificationService.getUnreadCount(
      req.user.userId.toString(),
    );
  }
}