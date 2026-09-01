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
  college?: string;
  department: string;
  academicYear: string;
  rollNumber: string;
  cityState: string;
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  paymentUtr: string;
  paymentMode: string;
  paymentTimestamp?: string;
}

export interface GeneratedPass {
  passId: string;
  fullName: string;
  email: string;
  phone?: string;
  category: string;
  institution: string;
  college?: string;
  department?: string;
  academicYear?: string;
  rollNumber?: string;
  cityState?: string;
  workstationNumber: string;
  seatStatus: string;
  paymentUtr?: string;
  paymentStatus?: 'VERIFIED' | 'PENDING' | 'FLAGGED';
  paymentAmount?: number;
  paymentTimestamp?: string;
  qrData: string;
  issuedAt: string;
  checkedIn?: boolean;
}
