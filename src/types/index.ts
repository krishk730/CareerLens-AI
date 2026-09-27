export interface UserProfile {
  userId: string;
  fullName: string;
  email: string;
  college?: string;
  currentYear?: string;
  careerGoal?: string;
  profilePhoto?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  degree?: string;
  branch?: string;
  graduationYear?: string;
  cgpa?: string;
  skills: {
    programmingLanguages: string[];
    frameworks: string[];
    databases: string[];
    dataScience: string[];
    softSkills: string[];
    other: string[];
  };
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
  }>;
  certificates: Array<{
    id: string;
    name: string;
    organization: string;
    issueDate: string;
    credentialUrl?: string;
  }>;
  experience: Array<{
    id: string;
    company: string;
    role: string;
    duration: string;
    description: string;
  }>;
  preferences: {
    targetRole?: string;
    preferredLocation?: string;
    workType?: 'remote' | 'hybrid' | 'on-site' | 'any';
    jobType?: 'internship' | 'full-time' | 'both';
    preferredSkills?: string[];
  };
  profileScore: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResumeSectionAnalysis {
  section: string;
  status: 'Strong' | 'Needs Improvement' | 'Missing';
  notes: string;
}

export interface ResumeAnalysisResult {
  id?: string;
  userId: string;
  fileName: string;
  score: number;
  atsReadabilityScore: number;
  extractedName?: string;
  extractedContact?: string;
  extractedEducation: string[];
  extractedSkills: string[];
  extractedProjects: string[];
  extractedExperience: string[];
  extractedCertificates: string[];
  strengths: string[];
  missingSkills: string[];
  weakSections: string[];
  sectionAnalysis: ResumeSectionAnalysis[];
  improvementSuggestions: string[];
  recommendedRoles: string[];
  recommendedKeywords: string[];
  actionPlan: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  createdAt: string;
  disclaimer: string;
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  workplaceType: 'Remote' | 'Hybrid' | 'On-site';
  jobType: 'Internship' | 'Full-time' | 'Part-time';
  experienceLevel: 'Entry-level / Fresher' | 'Intern' | '0-1 Years' | '1-3 Years';
  category: string;
  salaryRange?: string;
  description: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  postedDate: string;
  deadline?: string;
  applyUrl: string;
  isLiveSource?: boolean;
}

export interface JobMatchResult {
  jobId: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
  recommendedImprovements: string[];
  timestamp: string;
}

export interface ApplicationTrackerItem {
  id: string;
  userId: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  status: 'Saved' | 'Applied' | 'Interview' | 'Selected' | 'Rejected';
  appliedDate?: string;
  notes?: string;
  updatedAt: string;
}

export interface SkillGapAnalysisResult {
  id?: string;
  userId: string;
  targetRole: string;
  readinessScore: number;
  skillsYouHave: string[];
  skillsYouNeed: Array<{
    skill: string;
    priority: 'High' | 'Medium' | 'Low';
    importance: string;
  }>;
  personalizedRoadmap: Array<{
    week: number;
    title: string;
    objective: string;
    keyTopics: string[];
    recommendedProject: string;
    estimatedHours: number;
  }>;
  createdAt: string;
}

export interface CareerRecommendationItem {
  role: string;
  fitPercentage: number;
  whyFits: string;
  requiredSkills: string[];
  missingSkills: string[];
  marketDemand: 'High' | 'Very High' | 'Moderate';
  suggestedNextSteps: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'job' | 'resume' | 'skill' | 'application' | 'info';
  timestamp: string;
  read: boolean;
}
