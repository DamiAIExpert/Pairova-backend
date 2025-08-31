/**
 * @enum Role
 * @description Defines the user roles available within the Pairova application.
 * Using an enum ensures type safety and consistency when checking for user permissions.
 *
 * @value ADMIN - Has unrestricted access to all system functionalities, including the admin panel.
 * @value APPLICANT - Represents a job seeker. Can search for jobs, apply, and manage their profile.
 * @value NONPROFIT - Represents a non-profit organization. Can post jobs and manage applicants.
 */
export enum Role {
  ADMIN = 'admin',
  APPLICANT = 'applicant',
  NONPROFIT = 'nonprofit',
}
