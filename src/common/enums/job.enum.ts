// src/common/enums/job.enum.ts

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  VOLUNTEER = 'VOLUNTEER',
  INTERNSHIP = 'INTERNSHIP',
}

export enum JobPlacement {
  ONSITE = 'ONSITE',
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
}

export enum JobStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  PAUSED = 'PAUSED',
  CLOSED = 'CLOSED',
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  INTERVIEW = 'INTERVIEW',
  HIRED = 'HIRED',
  DENIED = 'DENIED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum InterviewStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}
