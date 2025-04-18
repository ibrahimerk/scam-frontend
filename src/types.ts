export interface Report {
  id?: number;
  title: string;
  description: string;
  scam_type: string;
  location: string;
  date_reported?: string;
  is_verified: boolean;
  evidence?: string;
  contact_info?: string;
  user?: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface Evidence {
  type: string;
  url: string;
  name: string;
}

export interface ScamReportFormData {
  title: string;
  description: string;
  scamType: string;
  scamUrl?: string;
  amount?: number;
  evidenceFiles?: File[];
}

export interface CommentFormData {
  text: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}
