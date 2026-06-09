import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { Doctor } from '../doctor/entities/doctor.entity';
import { Patient } from '../patient/entities/patient.entity';
import { User } from '../users/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'jaivya0323',
  database: 'schedula',

  entities: [Doctor, Patient, User],

  migrations: ['src/migrations/*.ts'],
});

export default AppDataSource;