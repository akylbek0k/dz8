export type SpecializationEnum = 'vocals' | 'guitar' | 'bass' | 'drums' | 'keys' | 'other';

export interface SpecializationChoiceItem {
  value: string;
  label: string;
}

export interface Profile {
  first_name?: string;
  specialization?: SpecializationEnum;
  specialization_display: string;
  bio?: string;
  fee?: string;
}

export interface UserProfile {
  id: number;
  username: string;
  profile: Profile;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface PatchedProfile {
  first_name?: string;
  specialization?: SpecializationEnum;
  bio?: string;
  fee?: string;
}

export interface ApiErrorResponse {
  detail?: string;
  username?: string[];
  password?: string[];
  first_name?: string[];
  specialization?: string[];
  fee?: string[];
  bio?: string[];
  [key: string]: unknown;
}
