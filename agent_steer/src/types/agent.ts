// Agent state types for CopilotKit integration

export interface AgentState {
  messages: string[];
  currentStep: WorkflowStep;
  userData: UserData | null;
  jobData: JobApplicationData | null;
  reviewData: ReviewData | null;
}

export type WorkflowStep =
  | 'idle'
  | 'login'
  | 'job_application'
  | 'review'
  | 'completed';

export interface UserData {
  name: string;
  email: string;
  mobile: string;
}

export interface JobApplicationData {
  full_name: string;
  position_applied: string;
  years_of_experience: number;
  skills: string;
  resume_url?: string;
  cover_letter?: string;
}

export interface ReviewData {
  availability: string;
  expected_salary: string;
  willing_to_relocate: string;
}

export interface WorkflowCompleteData {
  user: UserData;
  job: JobApplicationData;
  review: ReviewData;
}
