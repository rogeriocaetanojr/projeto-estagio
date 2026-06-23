export const USER_EVENTS_EXCHANGE = 'user.events';

export enum ProfileType {
  STUDENT = 'student',
  PROFESSOR = 'professor',
}

export interface UserRegisteredEvent {
  pattern: 'user_registered';
  data: {
    id: string;
    email: string;
    profileType: ProfileType;
  };
}
