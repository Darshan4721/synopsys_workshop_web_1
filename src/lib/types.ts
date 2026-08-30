export interface VlsiStage {
  id: string;
  stepNumber: string;
  name: string;
  tool: string;
  tagline: string;
  description: string;
  keyConcepts: string[];
  sampleCodeOrCommand: {
    language: string;
    filename: string;
    code: string;
  };
  outputSnippet: string;
}

export interface ScheduleItem {
  time: string;
  duration: string;
  title: string;
  type: 'session' | 'break' | 'hands-on' | 'keynote';
  toolBadge?: string;
  description: string;
  highlights: string[];
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  category: 'student' | 'research_scholar' | 'faculty' | 'industry_professional';
  institution: string;
  idNumber: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface GeneratedPass {
  passId: string;
  fullName: string;
  email: string;
  category: string;
  institution: string;
  workstationNumber: string;
  seatStatus: string;
  qrData: string;
  issuedAt: string;
}
