import 'dotenv/config';
import express, { Request, Response } from 'express';
import {
  analyzeResumeWithGemini,
  matchJobWithGemini,
  analyzeSkillGapWithGemini,
  getCareerRecommendationsWithGemini,
  chatWithAssistantWithGemini
} from './services/geminiService';
import { jobService } from './services/jobService';

export function createApiApp() {
  const app = express();

  // Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // System Health & Integration Status
  app.get('/api/health', (_req: Request, res: Response) => {
    const jobSource = jobService.getDataSourceStatus();
    res.json({
      status: 'ok',
      service: 'CareerLens AI Backend API',
      aiConfigured: Boolean(process.env.GEMINI_API_KEY),
      jobApiConfigured: jobSource.isLive,
      jobApiProvider: jobSource.provider,
      timestamp: new Date().toISOString()
    });
  });

  // Jobs Marketplace Endpoints
  app.get('/api/jobs', async (req: Request, res: Response) => {
    try {
      const { keyword, category, workplaceType, jobType, experienceLevel } = req.query;
      const result = await jobService.getJobs({
        keyword: keyword ? String(keyword) : undefined,
        category: category ? String(category) : undefined,
        workplaceType: workplaceType ? String(workplaceType) : undefined,
        jobType: jobType ? String(jobType) : undefined,
        experienceLevel: experienceLevel ? String(experienceLevel) : undefined
      });
      res.json(result);
    } catch (err: any) {
      console.error('Error fetching jobs:', err);
      res.status(500).json({ error: 'Failed to fetch opportunities' });
    }
  });

  app.get('/api/jobs/:id', async (req: Request, res: Response) => {
    try {
      const job = await jobService.getJobById(req.params.id);
      if (!job) {
        return res.status(404).json({ error: 'Opportunity not found' });
      }
      res.json(job);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch job details' });
    }
  });

  // AI Resume Analyzer Endpoint
  app.post('/api/ai/resume-analyze', async (req: Request, res: Response) => {
    try {
      const { resumeText, userId, fileName } = req.body;
      if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 20) {
        return res.status(400).json({
          error: 'Unable to read this resume. Please upload a valid PDF/DOCX or text file with readable content.'
        });
      }

      const analysis = await analyzeResumeWithGemini(
        resumeText,
        userId || 'anonymous-user',
        fileName || 'Resume.pdf'
      );
      res.json(analysis);
    } catch (err: any) {
      console.error('Resume Analysis Error:', err);
      res.status(500).json({
        error: err.message || 'AI analysis is temporarily unavailable. Please try again.'
      });
    }
  });

  // AI Job Matcher Endpoint
  app.post('/api/ai/job-match', async (req: Request, res: Response) => {
    try {
      const { profile, job } = req.body;
      if (!job) {
        return res.status(400).json({ error: 'Job details are required for matching.' });
      }

      const matchResult = await matchJobWithGemini(profile || {}, job);
      res.json(matchResult);
    } catch (err: any) {
      console.error('Job Matching Error:', err);
      res.status(500).json({
        error: 'Unable to calculate job match. Please try again.'
      });
    }
  });

  // AI Skill Gap Analyzer Endpoint
  app.post('/api/ai/skill-gap', async (req: Request, res: Response) => {
    try {
      const { targetRole, profile } = req.body;
      if (!targetRole) {
        return res.status(400).json({ error: 'Target role is required for skill gap analysis.' });
      }

      const result = await analyzeSkillGapWithGemini(targetRole, profile || {});
      res.json(result);
    } catch (err: any) {
      console.error('Skill Gap Analysis Error:', err);
      res.status(500).json({
        error: 'AI analysis is temporarily unavailable. Please try again.'
      });
    }
  });

  // AI Career Recommendations Endpoint
  app.post('/api/ai/career-recommendations', async (req: Request, res: Response) => {
    try {
      const { profile } = req.body;
      const recommendations = await getCareerRecommendationsWithGemini(profile || {});
      res.json(recommendations);
    } catch (err: any) {
      console.error('Career Recommendations Error:', err);
      res.status(500).json({
        error: 'Failed to generate career recommendations.'
      });
    }
  });

  // AI Career Assistant Chat Endpoint
  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    try {
      const { history, message, userContext } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message content is required.' });
      }

      const reply = await chatWithAssistantWithGemini(
        history || [],
        message,
        userContext || {}
      );
      res.json({ reply });
    } catch (err: any) {
      console.error('Chat Assistant Error:', err);
      res.status(500).json({
        error: 'AI assistant is temporarily unavailable. Please try again.'
      });
    }
  });

  return app;
}
