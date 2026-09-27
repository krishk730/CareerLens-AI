import { UserProfile, ResumeAnalysisResult, SkillGapAnalysisResult, CareerRecommendationItem } from '../types/index';

export const DEMO_PROFILE: UserProfile = {
  userId: 'demo-student-id',
  fullName: 'Alex Rivera',
  email: 'alex.rivera@university.edu',
  college: 'California State University',
  currentYear: '3rd Year (Junior)',
  careerGoal: 'Full Stack Software Engineer & AI Systems',
  profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  phone: '+1 (555) 234-5678',
  location: 'San Jose, CA',
  linkedin: 'https://linkedin.com/in/alex-rivera-cs',
  github: 'https://github.com/alexrivera-tech',
  portfolio: 'https://alexrivera.dev',
  degree: 'Bachelor of Science',
  branch: 'Computer Science & Engineering',
  graduationYear: '2026',
  cgpa: '3.82 / 4.0',
  skills: {
    programmingLanguages: ['Python', 'TypeScript', 'JavaScript', 'C++', 'Java', 'SQL'],
    frameworks: ['React', 'Next.js', 'Express', 'Tailwind CSS', 'FastAPI'],
    databases: ['PostgreSQL', 'MongoDB', 'Supabase', 'Redis'],
    dataScience: ['Pandas', 'NumPy', 'Scikit-Learn', 'Matplotlib'],
    softSkills: ['Problem Solving', 'Team Collaboration', 'Agile/Scrum', 'Technical Writing'],
    other: ['Git', 'Docker Basics', 'REST APIs', 'Linux', 'Vite']
  },
  projects: [
    {
      id: 'proj-1',
      name: 'CampusMarket - Peer-to-Peer Student Exchange',
      description: 'Built a full-stack marketplace connecting 1,200+ university students for textbook exchanges, equipment sharing, and safe transactions with OAuth and PostgreSQL.',
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
      githubUrl: 'https://github.com/alexrivera-tech/campus-market',
      liveUrl: 'https://campusmarket.demo.app'
    },
    {
      id: 'proj-2',
      name: 'InsightPulse - AI Medical Note Summarizer',
      description: 'Developed an LLM-assisted clinical note summarization pipeline using Python, FastAPI, and vector embeddings with 94% medical entity accuracy benchmark.',
      technologies: ['Python', 'FastAPI', 'Gemini API', 'ChromaDB', 'Docker'],
      githubUrl: 'https://github.com/alexrivera-tech/insight-pulse'
    }
  ],
  certificates: [
    {
      id: 'cert-1',
      name: 'Meta Front-End Developer Professional Certificate',
      organization: 'Meta / Coursera',
      issueDate: 'August 2025',
      credentialUrl: 'https://coursera.org/verify/meta-fe-alex'
    },
    {
      id: 'cert-2',
      name: 'PostgreSQL Database Design & Performance Tuning',
      organization: 'Stanford Online',
      issueDate: 'November 2025'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'TechNovate Labs (University Tech Incubator)',
      role: 'Software Engineering Intern',
      duration: 'May 2025 - August 2025',
      description: 'Refactored internal student portal microservices, reducing query latency by 32% and architecting automated testing pipelines covering 85% of critical user journeys.'
    }
  ],
  preferences: {
    targetRole: 'Full Stack Software Engineer',
    preferredLocation: 'San Francisco Bay Area / Remote',
    workType: 'remote',
    jobType: 'internship',
    preferredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL']
  },
  profileScore: 88,
  createdAt: '2026-01-15T09:00:00Z',
  updatedAt: '2026-09-20T14:30:00Z'
};

export const DEMO_RESUME_ANALYSIS: ResumeAnalysisResult = {
  id: 'demo-analysis-1',
  userId: 'demo-student-id',
  fileName: 'Alex_Rivera_Resume_2026.pdf',
  score: 82,
  atsReadabilityScore: 85,
  extractedName: 'Alex Rivera',
  extractedContact: 'alex.rivera@university.edu | (555) 234-5678',
  extractedEducation: ['BS in Computer Science, California State University (CGPA 3.82)'],
  extractedSkills: ['TypeScript', 'React', 'Python', 'FastAPI', 'Node.js', 'PostgreSQL', 'Docker', 'Git'],
  extractedProjects: ['CampusMarket Peer Marketplace', 'InsightPulse AI Note Summarizer'],
  extractedExperience: ['Software Engineering Intern at TechNovate Labs'],
  extractedCertificates: ['Meta Front-End Professional Certificate'],
  strengths: [
    'Strong balance of frontend and backend technical proficiencies.',
    'Clear measurable results in internship experience (reduced latency by 32%).',
    'High ATS readability with well-organized sections and clean typographic hierarchy.'
  ],
  missingSkills: [
    'Cloud Infrastructure (AWS ECS/GCP Cloud Run)',
    'CI/CD Orchestration (GitHub Actions pipelines)',
    'Kubernetes & Microservice Observability',
    'Automated End-to-End Testing (Playwright / Cypress)'
  ],
  weakSections: [
    'Summary section can be sharpened to highlight target specialization.'
  ],
  sectionAnalysis: [
    { section: 'Summary', status: 'Needs Improvement', notes: 'Consider a 2-line targeted elevator pitch highlighting your full-stack and systems passion.' },
    { section: 'Education', status: 'Strong', notes: 'Excellent academic standing (3.82 CGPA) and relevant coursework clearly highlighted.' },
    { section: 'Skills', status: 'Strong', notes: 'Modern, high-demand stack categorized logically.' },
    { section: 'Projects', status: 'Strong', notes: 'Production-ready projects with live demos and repository links.' },
    { section: 'Experience', status: 'Strong', notes: 'Action-oriented bullet points with concrete metrics.' },
    { section: 'Certificates', status: 'Strong', notes: 'Industry-recognized credentials verified.' }
  ],
  improvementSuggestions: [
    'Add an automated GitHub Actions CI/CD badge to your project repositories.',
    'Include 1-2 bullet points demonstrating unit or integration test coverage.',
    'Weave in keywords like "RESTful Architecture", "Distributed Systems", and "Cloud-native".',
    'Ensure all hyperlinks in the PDF are clickable and point directly to live deployments.'
  ],
  recommendedRoles: [
    'Full Stack Software Engineer Intern',
    'Junior Frontend Developer',
    'Associate Backend Engineer',
    'AI Solutions Engineer (Junior)'
  ],
  recommendedKeywords: [
    'REST APIs',
    'PostgreSQL Indexing',
    'State Management',
    'Docker Containerization',
    'Agile Methodologies',
    'CI/CD Workflows'
  ],
  actionPlan: [
    {
      step: 1,
      title: 'Containerize & Deploy on Cloud',
      description: 'Deploy one of your full-stack projects to Google Cloud Run or AWS using a Dockerfile.'
    },
    {
      step: 2,
      title: 'Add Automated Testing',
      description: 'Write Jest and Playwright test suites covering core API routes and authentication flows.'
    },
    {
      step: 3,
      title: 'Optimize ATS Headline',
      description: 'Refine the top header of your resume to clearly state "Aspiring Full Stack & AI Systems Engineer".'
    }
  ],
  createdAt: '2026-09-22T11:20:00Z',
  disclaimer: 'AI-generated analysis is advisory and should be reviewed by the candidate.'
};

export const DEMO_SKILL_ANALYSIS: SkillGapAnalysisResult = {
  id: 'demo-skill-1',
  userId: 'demo-student-id',
  targetRole: 'Full Stack Software Engineer',
  readinessScore: 78,
  skillsYouHave: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Git', 'Python'],
  skillsYouNeed: [
    { skill: 'Docker & Containerization', priority: 'High', importance: 'Standard for packaging microservices and reproducible dev environments.' },
    { skill: 'CI/CD Pipelines (GitHub Actions)', priority: 'High', importance: 'Critical for automated test runs and continuous deployment.' },
    { skill: 'Redis Caching & Pub/Sub', priority: 'Medium', importance: 'High-performance in-memory cache for distributed state and session storage.' },
    { skill: 'End-to-End Testing (Playwright)', priority: 'Medium', importance: 'Guarantees reliable user flows before production deployment.' },
    { skill: 'Cloud Architecture (GCP / AWS)', priority: 'Low', importance: 'Knowledge of serverless containers and IAM security policies.' }
  ],
  personalizedRoadmap: [
    {
      week: 1,
      title: 'Docker Mastery & Multi-Stage Builds',
      objective: 'Learn containerization principles, compose multi-container stacks, and write optimized Dockerfiles.',
      keyTopics: ['Container Lifecycle', 'Docker Compose with Postgres & Node', 'Alpine Base Images'],
      recommendedProject: 'Containerize CampusMarket with separate frontend, API, and database services.',
      estimatedHours: 10
    },
    {
      week: 2,
      title: 'CI/CD Automation with GitHub Actions',
      objective: 'Build automated continuous integration pipelines triggered on pull requests.',
      keyTopics: ['Workflows & Actions', 'Linting & Type-checking automation', 'Automated Unit Tests'],
      recommendedProject: 'Add a GitHub Actions pipeline that blocks merges if build or lint checks fail.',
      estimatedHours: 8
    },
    {
      week: 3,
      title: 'Caching & Asynchronous Processing with Redis',
      objective: 'Optimize read performance and implement rate limiting using Redis.',
      keyTopics: ['In-Memory Data Structures', 'Cache Invalidation Strategies', 'Rate Limiting Middleware'],
      recommendedProject: 'Add Redis caching to frequent search endpoints in your project.',
      estimatedHours: 12
    },
    {
      week: 4,
      title: 'End-to-End Testing & Cloud Deployment',
      objective: 'Write complete user journey tests and deploy to Google Cloud Run.',
      keyTopics: ['Playwright UI Automation', 'Cloud Run Service Config', 'Custom Domain & SSL'],
      recommendedProject: 'Deploy your containerized application with automated smoke tests.',
      estimatedHours: 12
    }
  ],
  createdAt: '2026-09-24T15:00:00Z'
};

export const DEMO_RECOMMENDATIONS: CareerRecommendationItem[] = [
  {
    role: 'Full Stack Software Engineer',
    fitPercentage: 88,
    whyFits: 'Your demonstrated ability to build end-to-end applications with React, TypeScript, and relational databases makes this your highest-leverage career path.',
    requiredSkills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'RESTful APIs', 'Docker'],
    missingSkills: ['Docker', 'CI/CD', 'Automated Testing'],
    marketDemand: 'Very High',
    suggestedNextSteps: [
      'Containerize existing web apps and deploy to modern cloud platforms.',
      'Practice medium-difficulty algorithm problems focusing on graphs and dynamic programming.'
    ]
  },
  {
    role: 'AI / Solutions Engineer (Junior)',
    fitPercentage: 81,
    whyFits: 'With strong Python fundamentals and hands-on LLM/vector database integration experience, you can bridge cutting-edge models with product software.',
    requiredSkills: ['Python', 'FastAPI', 'LLM Prompt Engineering', 'Vector DBs', 'TypeScript'],
    missingSkills: ['Evaluation Benchmarks', 'Streaming WebSockets', 'Latency Optimization'],
    marketDemand: 'Very High',
    suggestedNextSteps: [
      'Build a multimodal application utilizing real-time streaming APIs.',
      'Publish an open technical writeup analyzing LLM latency trade-offs.'
    ]
  },
  {
    role: 'Associate Data Analyst',
    fitPercentage: 75,
    whyFits: 'Your analytical mindset, SQL background, and Python data toolkit provide strong foundations for data-informed product decision roles.',
    requiredSkills: ['SQL', 'Python', 'Pandas', 'Tableau / BI', 'Statistical Modeling'],
    missingSkills: ['Power BI', 'Advanced Window Functions', 'A/B Testing Frameworks'],
    marketDemand: 'High',
    suggestedNextSteps: [
      'Build an interactive dashboard visualizing public labor market or economic datasets.',
      'Complete a course in A/B test sample size calculation and hypothesis testing.'
    ]
  },
  {
    role: 'Frontend Engineering Specialist',
    fitPercentage: 84,
    whyFits: 'Your design intuition, mastery of React hooks, component architecture, and responsive Tailwind styling align directly with modern UI product teams.',
    requiredSkills: ['React', 'TypeScript', 'Web Performance (Core Web Vitals)', 'Accessibility', 'CSS'],
    missingSkills: ['Web Workers', 'Micro-frontends', 'Advanced Animation Orchestration'],
    marketDemand: 'High',
    suggestedNextSteps: [
      'Audit your portfolio with Lighthouse to achieve 98+ scores across Performance and Accessibility.',
      'Contribute a component to an open-source design system.'
    ]
  }
];
