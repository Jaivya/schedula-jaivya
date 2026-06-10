import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getWelcome() {
    return {
      service: 'Schedula Backend API',
      status: 'running',
      environment: 'production',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}