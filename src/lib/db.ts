import { cache } from 'react';
import { supabaseAdmin } from './supabase/admin';

// Advanced Schema Types

export type LocalizedString = { en: string; hi: string; mr: string };

export interface VacancyCard {
  post_name: LocalizedString;
  total: string;
  education: LocalizedString;
  age_limit?: LocalizedString;
  salary?: LocalizedString;
  categories: Record<string, string>; // e.g., UR: '10', OBC: '5'
}

export interface QuickFacts {
  vacancies: string;
  last_date: LocalizedString;
  qualification: LocalizedString;
  age_limit: LocalizedString;
  job_location: LocalizedString;
  salary: LocalizedString;
  application_mode: LocalizedString;
}

export interface EligibilityRule {
  id: string;
  condition: LocalizedString;
  operator?: 'AND' | 'OR';
}

export interface AgeLimit {
  min_age: string;
  max_age: string;
  cutoff_date: string;
  relaxation: LocalizedString;
}

export interface ApplicationFee {
  category: LocalizedString;
  amount: LocalizedString;
}

export interface TimelineEvent {
  label: LocalizedString;
  date: LocalizedString;
}

export interface SelectionStep {
  step_number: number;
  title: LocalizedString;
  description: LocalizedString;
}

export interface DocumentItem {
  id: string;
  item: LocalizedString;
  is_required: boolean;
}

export interface ApplyStep {
  step_number: number;
  instruction: LocalizedString;
}

export interface ImportantLink {
  label: LocalizedString;
  url: string;
  is_primary?: boolean;
}

export interface JobFaq {
  question: LocalizedString;
  answer: LocalizedString;
}

export interface SyllabusTopic {
  title: LocalizedString;
}

export interface SyllabusSection {
  subject: LocalizedString;
  topics: SyllabusTopic[];
}

export interface JobComment {
  id: string;
  name: string;
  text: string;
  created_at: string;
  is_admin_reply?: boolean;
}

export interface SimilarJob {
  title: LocalizedString;
  slug: string;
  organization: LocalizedString;
  last_date: LocalizedString;
}

export interface Job {
  id: string;
  slug: string;
  title: LocalizedString;
  organization: LocalizedString;
  logo_url?: string;
  youtube_url?: string;
  status: string;
  statusColor: string;
  isLive: boolean;
  isTrending: boolean;
  daysLeft: number;
  
  // SEO & Meta
  seo_title: LocalizedString;
  seo_description: LocalizedString;
  focus_keyword: LocalizedString;
  seo_score: number;
  
  quick_facts?: QuickFacts;
  job_summary?: LocalizedString;
  important_dates?: TimelineEvent[];
  application_fee?: ApplicationFee[];
  age_limit?: AgeLimit;
  vacancy_cards?: VacancyCard[];
  education_qualification?: LocalizedString;
  required_documents?: DocumentItem[];
  selection_process?: SelectionStep[];
  salary_benefits?: LocalizedString;
  physical_standards?: LocalizedString;
  how_to_apply?: ApplyStep[];
  eligibility_rules?: EligibilityRule[];
  similar_jobs?: SimilarJob[];
  faqs?: JobFaq[];
  important_links?: ImportantLink[];
  
  category?: string;
  categories?: string[];
  comments?: JobComment[];
  syllabus?: SyllabusSection[];
  
  schema_settings?: {
    enable_job_schema?: boolean;
    enable_faq_schema?: boolean;
    enable_syllabus_schema?: boolean;
  };
  seo_matrix?: {
    states: string[];
    cities: string[];
    qualifications: string[];
    departments: string[];
  };

  salary_calculator?: {
    enabled: boolean;
    base_pay: number;
    pay_level: string; // e.g., 'Level 4'
    da_percent: number;
    hra_tier1_percent: number;
    hra_tier2_percent: number;
    hra_tier3_percent: number;
    ta_tier1_amount: number;
    ta_tier2_amount: number;
    custom_allowances: { name: string; amount: number }[];
  };

  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: LocalizedString;
  slug: string;
  icon: string;
  isTrending: boolean;
  isQuickLink: boolean;
}

export interface Announcement {
  id: string;
  text: LocalizedString;
  link: string;
  isActive: boolean;
  priority: 'high' | 'normal';
}

export interface PageSettings {
  seo: {
    title: LocalizedString;
    description: LocalizedString;
    keywords: LocalizedString;
  };
  hero: {
    title: LocalizedString;
    subtitle: LocalizedString;
  };
}

export interface HomepageSettings {
  seo: {
    title: LocalizedString;
    description: LocalizedString;
    keywords: LocalizedString;
    gscVerification?: string;
  };
  hero: {
    title: LocalizedString;
    subtitle: LocalizedString;
  };
  four_columns: {
    col1_category: string;
    col2_category: string;
    col3_category: string;
    col4_category: string;
  };
  announcements: Announcement[];
  pages?: {
    'admit-card': PageSettings;
    'results': PageSettings;
    'answer-key': PageSettings;
    'syllabus': PageSettings;
  };
}

const defaultSettings: HomepageSettings = {
  seo: {
    title: { en: "SarkariJob - Latest Government Jobs, Results & Admit Cards", hi: "", mr: "" },
    description: { en: "Find the latest Sarkari jobs, admit cards, results, and syllabus updates. Check your eligibility and apply online instantly.", hi: "", mr: "" },
    keywords: { en: "sarkari job, sarkari result, admit card, latest govt jobs", hi: "", mr: "" },
    gscVerification: ""
  },
  hero: {
    title: { en: "Latest Government Jobs, Results, Admit Cards & Eligibility Updates", hi: "", mr: "" },
    subtitle: { en: "Create your Naukri Passport profile once and check your eligibility for every job instantly.", hi: "", mr: "" }
  },
  four_columns: {
    col1_category: "Admit Card",
    col2_category: "Results",
    col3_category: "Answer Key",
    col4_category: "Syllabus"
  },
  announcements: [
    { id: 'a1', text: { en: "SSC CGL 2026 Notification Released - Apply Now!", hi: "", mr: "" }, link: "/jobs/ssc-cgl-2026", isActive: true, priority: "high" },
    { id: 'a2', text: { en: "UPSC Civil Services Prelims Admit Card Available", hi: "", mr: "" }, link: "/jobs/upsc-civil-services-2026", isActive: true, priority: "normal" }
  ],
  pages: {
    'admit-card': {
      seo: { title: { en: "Admit Cards - SarkariJob", hi: "", mr: "" }, description: { en: "Download latest admit cards", hi: "", mr: "" }, keywords: { en: "admit card", hi: "", mr: "" } },
      hero: { title: { en: "Download Admit Cards", hi: "", mr: "" }, subtitle: { en: "Get your hall tickets for upcoming exams", hi: "", mr: "" } }
    },
    'results': {
      seo: { title: { en: "Results - SarkariJob", hi: "", mr: "" }, description: { en: "Check latest exam results", hi: "", mr: "" }, keywords: { en: "results, exam results", hi: "", mr: "" } },
      hero: { title: { en: "Exam Results", hi: "", mr: "" }, subtitle: { en: "Check your selection status instantly", hi: "", mr: "" } }
    },
    'answer-key': {
      seo: { title: { en: "Answer Keys - SarkariJob", hi: "", mr: "" }, description: { en: "Download exam answer keys", hi: "", mr: "" }, keywords: { en: "answer key", hi: "", mr: "" } },
      hero: { title: { en: "Exam Answer Keys", hi: "", mr: "" }, subtitle: { en: "Verify your answers and calculate scores", hi: "", mr: "" } }
    },
    'syllabus': {
      seo: { title: { en: "Syllabus - SarkariJob", hi: "", mr: "" }, description: { en: "Download exam syllabus", hi: "", mr: "" }, keywords: { en: "syllabus", hi: "", mr: "" } },
      hero: { title: { en: "Exam Syllabus", hi: "", mr: "" }, subtitle: { en: "Prepare with the official syllabus", hi: "", mr: "" } }
    }
  }
};

export const getCategories = cache(async (): Promise<Category[]> => {
  const { data, error } = await supabaseAdmin.from('categories').select('data');
  if (error || !data) return [];
  return data.map(row => row.data as Category);
});

export async function saveCategories(categories: Category[]): Promise<void> {
  const rows = categories.map(c => ({ id: c.id, slug: c.slug, data: c }));
  await supabaseAdmin.from('categories').upsert(rows);
}

export const getSettings = cache(async (): Promise<HomepageSettings> => {
  const { data, error } = await supabaseAdmin.from('settings').select('data').eq('id', 'global').single();
  if (error || !data) return defaultSettings;
  return data.data as HomepageSettings;
});

export async function saveSettings(settings: HomepageSettings): Promise<void> {
  await supabaseAdmin.from('settings').upsert({ id: 'global', data: settings });
}

export const getJobs = cache(async (): Promise<Job[]> => {
  const { data, error } = await supabaseAdmin
    .from('jobs')
    .select('data')
    .order('created_at', { ascending: false });
    
  if (error || !data) {
    console.error('Error fetching jobs from Supabase:', error);
    return [];
  }
  return data.map(row => row.data as Job);
});

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find(c => c.slug === slug) || null;
}

export async function getJobsByCategorySlug(slug: string): Promise<Job[]> {
  const jobs = await getJobs();
  const category = await getCategoryBySlug(slug);
  
  const searchString = category ? category.name.en.toLowerCase() : slug.toLowerCase().replace(/-/g, ' ');

  return jobs.filter(job => {
    if (job.category && job.category.toLowerCase() === searchString) return true;
    if (job.categories && job.categories.some(c => c.toLowerCase() === searchString)) return true;
    return false;
  });
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  const jobs = await getJobs();
  return jobs.find(j => j.slug === slug) || null;
}

export async function createJob(job: Omit<Job, 'id' | 'created_at'>): Promise<Job> {
  const newJob: Job = {
    ...job,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  
  await supabaseAdmin.from('jobs').insert({
    id: newJob.id,
    slug: newJob.slug,
    created_at: newJob.created_at,
    updated_at: newJob.created_at,
    data: newJob
  });
  
  return newJob;
}

export async function updateJob(id: string, jobData: Partial<Job>): Promise<Job | null> {
  const { data: row } = await supabaseAdmin.from('jobs').select('data').eq('id', id).single();
  if (!row) return null;
  
  const updatedJob = {
    ...row.data,
    ...jobData,
    updated_at: new Date().toISOString()
  };
  
  await supabaseAdmin.from('jobs').update({
    slug: updatedJob.slug,
    updated_at: updatedJob.updated_at,
    data: updatedJob
  }).eq('id', id);
  
  return updatedJob;
}

export async function deleteJob(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin.from('jobs').delete().eq('id', id);
  return !error;
}

export async function addJobComment(slug: string, comment: Omit<JobComment, 'id' | 'created_at'>): Promise<JobComment | null> {
  const { data: row } = await supabaseAdmin.from('jobs').select('data, id').eq('slug', slug).single();
  if (!row) return null;
  
  const job = row.data as Job;
  const newComment: JobComment = {
    ...comment,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  
  if (!job.comments) job.comments = [];
  job.comments.unshift(newComment);
  
  await supabaseAdmin.from('jobs').update({
    data: job
  }).eq('id', row.id);
  
  return newComment;
}
