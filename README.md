# Schedula - Doctor Appointment Booking System

## Project Overview

Schedula is a Doctor Appointment Booking System built using NestJS, MongoDB, and JWT Authentication. The system allows doctors to manage their availability and appointments while enabling patients to discover doctors, book appointments, cancel appointments, and reschedule appointments.

---

## Tech Stack

* NestJS
* TypeScript
* MongoDB Atlas
* Mongoose
* JWT Authentication
* Class Validator
* Render (Deployment)

---

## Project Setup

### Clone Repository

```bash
git clone https://github.com/Jaivya/schedula-jaivya.git
cd hello-world-api
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
PORT=3000
```

### Run Application

Development Mode

```bash
npm run start:dev
```

Production Mode

```bash
npm run start:prod
```

---

## Features Implemented

### Authentication

* User Signup
* User Login
* JWT Authentication
* Role-Based Authorization

### Doctor Management

* Create Doctor Profile
* Get Doctor Profile
* Update Doctor Profile
* Doctor Discovery API
* Doctor Details API

### Patient Management

* Create Patient Profile
* Get Patient Profile
* Update Patient Profile

### Availability Management

* Create Availability
* Update Availability
* Delete Availability
* Availability Overrides
* Get Availability By Date

### Slot Generation

* Automatic Slot Generation
* Stream Scheduling
* Wave Scheduling
* Capacity Handling
* Token Assignment

### Appointment Management

* Book Appointment
* Get Patient Appointments
* Get Doctor Appointments
* Cancel Appointment
* Appointment Ownership Validation
* Duplicate Booking Prevention
* Future Appointment Validation

### Appointment Rescheduling

* Reschedule Existing Appointment
* Slot Availability Validation
* Booked Slot Validation
* Availability Validation
* Conflict Detection
* Next Available Slot Suggestion

---

## API Collection

API Collection File:

```text
api-collection.json
```

API Collection Link:

```text
https://github.com/Jaivya/schedula-jaivya/blob/main/api-collection.json
```

---

## Repository

GitHub Repository:

```text
https://github.com/Jaivya/schedula-jaivya
```

---

## Live Server URL

```text
https://schedula-jaivya.onrender.com
```

---

## GitHub Workflow Concepts Learned

* Repository Structure
* Branches
* Pull Requests
* Commits
* Code Reviews
* Merge Process
* Branching Strategy
* Creating Branches from Main
* Creating Branches from Feature Branches
* Conflict Resolution

---

## Author

Jaivya Chawla

Backend Internship Program
