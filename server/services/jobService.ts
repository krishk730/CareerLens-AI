import type { JobOpportunity } from '../../src/types/index';

// Configurable External Job API environment settings
const JOB_API_KEY = process.env.JOB_API_KEY || '';
const JOB_API_BASE_URL = process.env.JOB_API_BASE_URL || '';

// High quality curated opportunities dataset for students & freshers
const CURATED_DEMO_JOBS: JobOpportunity[] = [
  {
    id: 'demo-job-1',
    title: 'Software Engineer Intern (Frontend / Full Stack)',
    company: 'Stripe',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
    location: 'San Francisco, CA / Remote',
    workplaceType: 'Remote',
    jobType: 'Internship',
    experienceLevel: 'Intern',
    category: 'Software Development',
    salaryRange: '$48 - $58 / hr',
    description: 'Join our developer experience team to build delightful developer tools, SDK interfaces, and real-time dashboard components using modern React, TypeScript, and distributed microservices.',
    requiredSkills: ['React', 'TypeScript', 'JavaScript', 'HTML/CSS', 'Git'],
    preferredSkills: ['Node.js', 'Tailwind CSS', 'REST APIs', 'GraphQL'],
    postedDate: '2 days ago',
    deadline: 'In 3 weeks',
    applyUrl: 'https://stripe.com/jobs',
    isLiveSource: false
  },
  {
    id: 'demo-job-2',
    title: 'Associate Data Analyst',
    company: 'Spotify',
    companyLogo: 'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=100&auto=format&fit=crop&q=60',
    location: 'New York, NY',
    workplaceType: 'Hybrid',
    jobType: 'Full-time',
    experienceLevel: 'Entry-level / Fresher',
    category: 'Data Analyst',
    salaryRange: '$85,000 - $105,000 / yr',
    description: 'Collaborate with product and content teams to evaluate music discovery algorithms, design A/B testing metrics, and create automated executive dashboards in SQL and Tableau.',
    requiredSkills: ['SQL', 'Python', 'Pandas', 'Data Visualization', 'Statistics'],
    preferredSkills: ['Tableau', 'BigQuery', 'Excel', 'A/B Testing'],
    postedDate: '3 days ago',
    deadline: 'In 2 weeks',
    applyUrl: 'https://spotify.com/careers',
    isLiveSource: false
  },
  {
    id: 'demo-job-3',
    title: 'Machine Learning Engineering Intern',
    company: 'DeepMind / Google AI',
    companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=60',
    location: 'Mountain View, CA',
    workplaceType: 'Hybrid',
    jobType: 'Internship',
    experienceLevel: 'Intern',
    category: 'AI/ML',
    salaryRange: '$55 - $65 / hr',
    description: 'Work alongside research scientists on generative model evaluation, multimodal reasoning benchmarks, and efficient neural network fine-tuning workflows.',
    requiredSkills: ['Python', 'PyTorch', 'Linear Algebra', 'NumPy', 'Git'],
    preferredSkills: ['Transformers', 'TensorFlow', 'CUDA', 'C++'],
    postedDate: '1 day ago',
    deadline: 'In 10 days',
    applyUrl: 'https://careers.google.com',
    isLiveSource: false
  },
  {
    id: 'demo-job-4',
    title: 'Junior Backend Developer',
    company: 'Datadog',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=60',
    location: 'Boston, MA / Remote',
    workplaceType: 'Remote',
    jobType: 'Full-time',
    experienceLevel: '0-1 Years',
    category: 'Software Development',
    salaryRange: '$90,000 - $115,000 / yr',
    description: 'Build high-throughput telemetry ingestion pipelines, optimize distributed database queries, and contribute to production services handling millions of metrics per second.',
    requiredSkills: ['Go', 'Python', 'PostgreSQL', 'Docker', 'REST APIs'],
    preferredSkills: ['Kubernetes', 'Redis', 'Kafka', 'Linux'],
    postedDate: '4 days ago',
    deadline: 'Open until filled',
    applyUrl: 'https://datadoghq.com/careers',
    isLiveSource: false
  },
  {
    id: 'demo-job-5',
    title: 'Data Science Intern',
    company: 'Airbnb',
    companyLogo: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=100&auto=format&fit=crop&q=60',
    location: 'Seattle, WA / Remote',
    workplaceType: 'Remote',
    jobType: 'Internship',
    experienceLevel: 'Intern',
    category: 'Data Science',
    salaryRange: '$50 - $60 / hr',
    description: 'Formulate predictive models for search ranking, guest booking behavior, and pricing elasticity. Translate messy real-world transaction data into actionable product experiments.',
    requiredSkills: ['Python', 'R', 'SQL', 'Scikit-Learn', 'Statistics'],
    preferredSkills: ['Spark', 'Causal Inference', 'Seaborn', 'Hypothesis Testing'],
    postedDate: 'Just now',
    deadline: 'In 4 weeks',
    applyUrl: 'https://airbnb.com/careers',
    isLiveSource: false
  },
  {
    id: 'demo-job-6',
    title: 'Cyber Security Analyst (Entry-level)',
    company: 'CrowdStrike',
    companyLogo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=60',
    location: 'Austin, TX',
    workplaceType: 'On-site',
    jobType: 'Full-time',
    experienceLevel: '0-1 Years',
    category: 'Cyber Security',
    salaryRange: '$80,000 - $95,000 / yr',
    description: 'Monitor threat alerts, perform vulnerability assessments, investigate security telemetry incidents, and help fortify endpoint detection rules.',
    requiredSkills: ['Network Security', 'Linux', 'Python / Bash', 'Security Principles', 'Wireshark'],
    preferredSkills: ['SIEM Tools', 'CompTIA Security+', 'Threat Hunting', 'Cloud Security'],
    postedDate: '5 days ago',
    deadline: 'In 2 weeks',
    applyUrl: 'https://crowdstrike.com/careers',
    isLiveSource: false
  },
  {
    id: 'demo-job-7',
    title: 'Junior Web Developer (React / Next.js)',
    company: 'Vercel',
    companyLogo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=60',
    location: 'San Francisco, CA / Remote',
    workplaceType: 'Remote',
    jobType: 'Full-time',
    experienceLevel: 'Entry-level / Fresher',
    category: 'Web Development',
    salaryRange: '$85,000 - $110,000 / yr',
    description: 'Craft high-performance, accessible web applications and developer documentation. Implement responsive components with modern CSS, TypeScript, and server components.',
    requiredSkills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Git'],
    preferredSkills: ['Node.js', 'Edge Functions', 'Accessibility (a11y)', 'SEO'],
    postedDate: '3 days ago',
    deadline: 'In 3 weeks',
    applyUrl: 'https://vercel.com/careers',
    isLiveSource: false
  },
  {
    id: 'demo-job-8',
    title: 'Business & Analytics Intern',
    company: 'McKinsey & Company',
    companyLogo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=60',
    location: 'Chicago, IL',
    workplaceType: 'Hybrid',
    jobType: 'Internship',
    experienceLevel: 'Intern',
    category: 'Business/Data Analytics',
    salaryRange: '$40 - $48 / hr',
    description: 'Synthesize quantitative market research, build economic scenario models in Excel/Python, and deliver presentations to cross-functional leadership teams.',
    requiredSkills: ['Excel', 'Data Analysis', 'Problem Solving', 'Power BI / Tableau', 'Communication'],
    preferredSkills: ['SQL', 'Python', 'Financial Modeling', 'Market Sizing'],
    postedDate: '6 days ago',
    deadline: 'In 1 week',
    applyUrl: 'https://mckinsey.com/careers',
    isLiveSource: false
  }
];

function isValidHttpUrl(urlString: string): boolean {
  if (!urlString || typeof urlString !== 'string') return false;
  const trimmed = urlString.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return false;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export class JobService {
  private isLiveConfigured(): boolean {
    return Boolean(JOB_API_KEY && isValidHttpUrl(JOB_API_BASE_URL));
  }

  public getDataSourceStatus(): { isLive: boolean; provider: string } {
    const isLive = this.isLiveConfigured();
    return {
      isLive,
      provider: isLive ? 'External Job API (Configured)' : 'Demo Opportunities Dataset'
    };
  }

  public async getJobs(params?: {
    keyword?: string;
    category?: string;
    workplaceType?: string;
    jobType?: string;
    experienceLevel?: string;
  }): Promise<{ jobs: JobOpportunity[]; isLive: boolean; total: number }> {
    // If real external Job API is configured with a valid URL, proxy request securely
    if (this.isLiveConfigured()) {
      try {
        const baseUrl = JOB_API_BASE_URL.trim().replace(/\/+$/, '');
        const targetUrl = new URL(`${baseUrl}/jobs`);
        if (params?.keyword) targetUrl.searchParams.set('q', params.keyword);
        if (params?.category) targetUrl.searchParams.set('category', params.category);
        if (params?.jobType) targetUrl.searchParams.set('type', params.jobType);

        const response = await fetch(targetUrl.toString(), {
          headers: {
            'Authorization': `Bearer ${JOB_API_KEY}`,
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const items: JobOpportunity[] = (data.jobs || data.results || []).map((item: any) => ({
            id: String(item.id || item.job_id),
            title: item.title,
            company: item.company?.name || item.company_name || item.company || 'Enterprise Company',
            companyLogo: item.company?.logo || item.logo || '',
            location: item.location || 'Remote',
            workplaceType: item.is_remote ? 'Remote' : (item.workplace_type || 'Hybrid'),
            jobType: item.job_type || 'Full-time',
            experienceLevel: item.experience_level || 'Entry-level / Fresher',
            category: item.category || 'Software Development',
            salaryRange: item.salary || undefined,
            description: item.description || '',
            requiredSkills: Array.isArray(item.skills) ? item.skills : ['Problem Solving', 'Engineering'],
            postedDate: item.posted_date || 'Recently',
            applyUrl: item.url || item.apply_url || '#',
            isLiveSource: true
          }));

          return {
            jobs: items,
            isLive: true,
            total: items.length
          };
        }
      } catch (err) {
        console.warn('External Job API call failed, falling back to curated demo dataset:', err);
      }
    }

    // Default high-quality curated demo opportunities
    let filtered = [...CURATED_DEMO_JOBS];

    if (params?.keyword) {
      const q = params.keyword.toLowerCase();
      filtered = filtered.filter(j =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.requiredSkills.some(s => s.toLowerCase().includes(q))
      );
    }

    if (params?.category && params.category !== 'All') {
      filtered = filtered.filter(j => j.category.toLowerCase() === params.category!.toLowerCase());
    }

    if (params?.workplaceType && params.workplaceType !== 'All') {
      filtered = filtered.filter(j => j.workplaceType.toLowerCase() === params.workplaceType!.toLowerCase());
    }

    if (params?.jobType && params.jobType !== 'All') {
      filtered = filtered.filter(j => j.jobType.toLowerCase() === params.jobType!.toLowerCase());
    }

    if (params?.experienceLevel && params.experienceLevel !== 'All') {
      filtered = filtered.filter(j => j.experienceLevel.toLowerCase() === params.experienceLevel!.toLowerCase());
    }

    return {
      jobs: filtered,
      isLive: false,
      total: filtered.length
    };
  }

  public async getJobById(id: string): Promise<JobOpportunity | null> {
    const job = CURATED_DEMO_JOBS.find(j => j.id === id);
    return job || null;
  }
}

export const jobService = new JobService();
