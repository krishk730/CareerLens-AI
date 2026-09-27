import {
  JobOpportunity,
  ResumeAnalysisResult,
  JobMatchResult,
  SkillGapAnalysisResult,
  CareerRecommendationItem,
  UserProfile
} from '../types/index';

async function safeJson<T>(res: Response, fallbackErrorMessage: string): Promise<T> {
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('API server is connecting. Please try again.');
  }
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || fallbackErrorMessage);
  }
  return data as T;
}

export async function fetchHealthStatus() {
  const res = await fetch('/api/health');
  return safeJson<any>(res, 'Failed to fetch health status');
}

export async function fetchJobsList(params?: {
  keyword?: string;
  category?: string;
  workplaceType?: string;
  jobType?: string;
  experienceLevel?: string;
}): Promise<{ jobs: JobOpportunity[]; isLive: boolean; total: number }> {
  const query = new URLSearchParams();
  if (params?.keyword) query.set('keyword', params.keyword);
  if (params?.category) query.set('category', params.category);
  if (params?.workplaceType) query.set('workplaceType', params.workplaceType);
  if (params?.jobType) query.set('jobType', params.jobType);
  if (params?.experienceLevel) query.set('experienceLevel', params.experienceLevel);

  const res = await fetch(`/api/jobs?${query.toString()}`);
  return safeJson<{ jobs: JobOpportunity[]; isLive: boolean; total: number }>(res, 'Failed to load opportunities');
}

export async function fetchJobDetails(id: string): Promise<JobOpportunity> {
  const res = await fetch(`/api/jobs/${id}`);
  return safeJson<JobOpportunity>(res, 'Failed to load opportunity details');
}

export async function runResumeAnalysis(
  resumeText: string,
  userId: string,
  fileName: string
): Promise<ResumeAnalysisResult> {
  const res = await fetch('/api/ai/resume-analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeText, userId, fileName })
  });

  return safeJson<ResumeAnalysisResult>(res, 'AI analysis is temporarily unavailable. Please try again.');
}

export async function runJobMatch(
  profile: Partial<UserProfile>,
  job: JobOpportunity
): Promise<JobMatchResult> {
  const res = await fetch('/api/ai/job-match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile, job })
  });

  return safeJson<JobMatchResult>(res, 'Unable to calculate job match. Please try again.');
}

export async function runSkillGapAnalysis(
  targetRole: string,
  profile: Partial<UserProfile>
): Promise<SkillGapAnalysisResult> {
  const res = await fetch('/api/ai/skill-gap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetRole, profile })
  });

  return safeJson<SkillGapAnalysisResult>(res, 'AI analysis is temporarily unavailable. Please try again.');
}

export async function fetchCareerRecommendations(
  profile: Partial<UserProfile>
): Promise<CareerRecommendationItem[]> {
  const res = await fetch('/api/ai/career-recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profile })
  });

  return safeJson<CareerRecommendationItem[]>(res, 'Failed to generate career recommendations.');
}

export async function sendChatMessage(
  history: Array<{ role: string; content: string }>,
  message: string,
  userContext: {
    fullName?: string;
    targetRole?: string;
    skills?: string[];
    resumeScore?: number;
    readinessScore?: number;
    recentApplications?: number;
  }
): Promise<{ reply: string }> {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ history, message, userContext })
  });

  return safeJson<{ reply: string }>(res, 'AI assistant is temporarily unavailable. Please try again.');
}
