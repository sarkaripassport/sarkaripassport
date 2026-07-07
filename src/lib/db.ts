import fs from 'fs/promises';
import path from 'path';
import { cache } from 'react';

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

const DB_PATH = path.join(process.cwd(), 'jobs-db.json');
const CATEGORIES_DB = path.join(process.cwd(), 'categories-db.json');
const SETTINGS_DB = path.join(process.cwd(), 'settings-db.json');

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

// Initialize the database with premium mock data
async function initDb() {
  try {
    await fs.access(DB_PATH);
  } catch (error) {
    const defaultData: Job[] = [
      {
        id: "1",
        slug: "upsc-civil-services-2026",
        title: { en: "UPSC Civil Services Examination 2026", hi: "", mr: "" },
        organization: { en: "Union Public Service Commission", hi: "", mr: "" },
        logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1024px-Emblem_of_India.svg.png",
        status: "Active",
        statusColor: "text-green-800 bg-green-100 border-green-200",
        isLive: true,
        isTrending: true,
        daysLeft: 14,
        
        seo_title: { en: "UPSC Civil Services (IAS/IPS) Notification 2026 - Apply Online", hi: "", mr: "" },
        seo_description: { en: "Apply online for 1,105 IAS, IPS, IFS vacancies under UPSC Civil Services 2026. Check eligibility, syllabus, and exam pattern.", hi: "", mr: "" },
        focus_keyword: { en: "UPSC Civil Services 2026", hi: "", mr: "" },
        seo_score: 95,
        
        quick_facts: {
          vacancies: "1,105",
          last_date: { en: "15 Jul 2026", hi: "", mr: "" },
          qualification: { en: "Graduation", hi: "", mr: "" },
          age_limit: { en: "21-32 Years", hi: "", mr: "" },
          job_location: { en: "All India", hi: "", mr: "" },
          salary: { en: "₹56,100 - ₹2,50,000", hi: "", mr: "" },
          application_mode: { en: "Online", hi: "", mr: "" }
        },
        
        job_summary: { en: "The Union Public Service Commission (UPSC) has published the Civil Services Examination 2026 notification to recruit 1,105 officers for IAS, IPS, IFS, and other central services. Eligible candidates holding a bachelor's degree can apply online before July 15, 2026.", hi: "", mr: "" },
        
        important_dates: [
          { label: { en: "Notification Released", hi: "", mr: "" }, date: { en: "05 June 2026", hi: "", mr: "" } },
          { label: { en: "Online Application Starts", hi: "", mr: "" }, date: { en: "05 June 2026", hi: "", mr: "" } },
          { label: { en: "Last Date to Apply", hi: "", mr: "" }, date: { en: "15 July 2026", hi: "", mr: "" } },
          { label: { en: "Prelims Admit Card", hi: "", mr: "" }, date: { en: "September 2026", hi: "", mr: "" } },
          { label: { en: "Prelims Exam", hi: "", mr: "" }, date: { en: "26 September 2026", hi: "", mr: "" } }
        ],
        
        application_fee: [
          { category: { en: "General / OBC", hi: "", mr: "" }, amount: { en: "₹100/-", hi: "", mr: "" } },
          { category: { en: "SC / ST / PwBD / Women", hi: "", mr: "" }, amount: { en: "Exempted", hi: "", mr: "" } }
        ],
        
        age_limit: {
          min_age: "21 Years",
          max_age: "32 Years",
          cutoff_date: "01/08/2026",
          relaxation: { en: "OBC: 3 Years | SC/ST: 5 Years | PwBD: 10 Years", hi: "", mr: "" }
        },
        
        vacancy_cards: [
          { post_name: { en: "Indian Administrative Service (IAS)", hi: "", mr: "" }, total: "180", education: { en: "Any Degree", hi: "", mr: "" }, categories: { UR: "73", OBC: "49", SC: "27", ST: "13", EWS: "18" } },
          { post_name: { en: "Indian Police Service (IPS)", hi: "", mr: "" }, total: "200", education: { en: "Any Degree", hi: "", mr: "" }, categories: { UR: "80", OBC: "54", SC: "30", ST: "15", EWS: "21" } },
          { post_name: { en: "Indian Foreign Service (IFS)", hi: "", mr: "" }, total: "35", education: { en: "Any Degree", hi: "", mr: "" }, categories: { UR: "16", OBC: "10", SC: "5", ST: "2", EWS: "2" } },
        ],
        
        education_qualification: { en: "<p>Candidates must hold a degree of any of the Universities incorporated by an Act of the Central or State Legislature in India or other educational institutions established by an Act of Parliament or declared to be deemed as a University Under Section-3 of the University Grants Commission Act, 1956, or possess an equivalent qualification.</p>", hi: "", mr: "" },
        
        required_documents: [
          { id: "d1", item: { en: "Scanned Photograph (20-300 KB, JPG)", hi: "", mr: "" }, is_required: true },
          { id: "d2", item: { en: "Scanned Signature (20-300 KB, JPG)", hi: "", mr: "" }, is_required: true },
          { id: "d3", item: { en: "Photo ID Proof (Aadhaar/PAN/Voter ID)", hi: "", mr: "" }, is_required: true },
          { id: "d4", item: { en: "Graduation Marksheet/Certificate", hi: "", mr: "" }, is_required: false },
          { id: "d5", item: { en: "Category Certificate (if applicable)", hi: "", mr: "" }, is_required: true }
        ],
        
        selection_process: [
          { step_number: 1, title: { en: "Preliminary Examination", hi: "", mr: "" }, description: { en: "Objective type papers (GS Paper I & CSAT Paper II) for selection of candidates for the Main Examination.", hi: "", mr: "" } },
          { step_number: 2, title: { en: "Main Examination", hi: "", mr: "" }, description: { en: "Written examination consisting of 9 papers of conventional essay type.", hi: "", mr: "" } },
          { step_number: 3, title: { en: "Interview / Personality Test", hi: "", mr: "" }, description: { en: "Interview to assess the personal suitability of the candidate for a career in public service.", hi: "", mr: "" } }
        ],
        
        salary_benefits: { en: "<p>The starting basic pay for IAS/IPS officers is ₹56,100 (Level 10 of Pay Matrix). Along with the basic pay, officers are entitled to Dearness Allowance (DA), House Rent Allowance (HRA), Transport Allowance (TA), and excellent perks including medical facilities, housing, and pension.</p>", hi: "", mr: "" },
        
        how_to_apply: [
          { step_number: 1, instruction: { en: "Visit the official UPSC online portal at upsc.gov.in.", hi: "", mr: "" } },
          { step_number: 2, instruction: { en: "Complete the One Time Registration (OTR) if not already registered.", hi: "", mr: "" } },
          { step_number: 3, instruction: { en: "Login using OTR ID and click on 'Apply Online' for Civil Services.", hi: "", mr: "" } },
          { step_number: 4, instruction: { en: "Fill the application form, select exam center, and upload required documents.", hi: "", mr: "" } },
          { step_number: 5, instruction: { en: "Pay the application fee and submit the final form. Take a printout.", hi: "", mr: "" } }
        ],
        
        eligibility_rules: [
          { id: "r1", condition: { en: "Bachelor's Degree", hi: "", mr: "" }, operator: "AND" },
          { id: "r2", condition: { en: "Age 21-32", hi: "", mr: "" }, operator: "OR" },
          { id: "r3", condition: { en: "Age relaxation applicable for reserved categories", hi: "", mr: "" } }
        ],
        
        similar_jobs: [
          { title: { en: "SSC CGL 2026", hi: "", mr: "" }, slug: "ssc-cgl-2026", organization: { en: "Staff Selection Commission", hi: "", mr: "" }, last_date: { en: "24 Jun 2026", hi: "", mr: "" } },
          { title: { en: "IBPS PO 2026", hi: "", mr: "" }, slug: "ibps-po-2026", organization: { en: "Institute of Banking Personnel Selection", hi: "", mr: "" }, last_date: { en: "12 Aug 2026", hi: "", mr: "" } }
        ],
        
        faqs: [
          { question: { en: "Can final year students apply for UPSC CSE?", hi: "", mr: "" }, answer: { en: "Yes, candidates in their final year of graduation can apply, provided they submit proof of passing the examination at the time of the Main Examination.", hi: "", mr: "" } },
          { question: { en: "Is there a limit on the number of attempts?", hi: "", mr: "" }, answer: { en: "Yes. General category candidates have 6 attempts. OBC candidates have 9 attempts. SC/ST candidates have unlimited attempts up to the age limit.", hi: "", mr: "" } }
        ],
        
        important_links: [
          { label: { en: "Apply Online (OTR)", hi: "", mr: "" }, url: "https://upsconline.nic.in", is_primary: true },
          { label: { en: "Download Notification", hi: "", mr: "" }, url: "#", is_primary: false },
          { label: { en: "Official Website", hi: "", mr: "" }, url: "https://upsc.gov.in", is_primary: false }
        ],
        
        category: "Latest Jobs",
        categories: ["Latest Jobs", "Admit Card", "UPSC"],
        
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        updated_at: new Date().toISOString()
      }
    ];
    await fs.writeFile(DB_PATH, JSON.stringify(defaultData, null, 2));
  }

  // Init Categories
  try {
    await fs.access(CATEGORIES_DB);
  } catch (error) {
    const defaultCategories: Category[] = [
      { id: 'c1', name: { en: 'Latest Jobs', hi: '', mr: '' }, slug: 'latest-jobs', icon: 'Briefcase', isTrending: false, isQuickLink: true },
      { id: 'c2', name: { en: 'Admit Card', hi: '', mr: '' }, slug: 'admit-card', icon: 'FileText', isTrending: false, isQuickLink: true },
      { id: 'c3', name: { en: 'Results', hi: '', mr: '' }, slug: 'results', icon: 'Award', isTrending: false, isQuickLink: true },
      { id: 'c4', name: { en: 'Answer Key', hi: '', mr: '' }, slug: 'answer-key', icon: 'CheckCircle2', isTrending: false, isQuickLink: true },
      { id: 'c5', name: { en: 'Syllabus', hi: '', mr: '' }, slug: 'syllabus', icon: 'GraduationCap', isTrending: false, isQuickLink: true },
      { id: 'c6', name: { en: 'Admission', hi: '', mr: '' }, slug: 'admission', icon: 'Building2', isTrending: false, isQuickLink: true },
      { id: 'c7', name: { en: 'SSC', hi: '', mr: '' }, slug: 'ssc', icon: 'Landmark', isTrending: true, isQuickLink: false },
      { id: 'c8', name: { en: 'Railway', hi: '', mr: '' }, slug: 'railway', icon: 'Train', isTrending: true, isQuickLink: false },
      { id: 'c9', name: { en: 'Bank', hi: '', mr: '' }, slug: 'bank', icon: 'Building2', isTrending: true, isQuickLink: false },
      { id: 'c10', name: { en: 'Police', hi: '', mr: '' }, slug: 'police', icon: 'ShieldCheck', isTrending: true, isQuickLink: false },
      { id: 'c11', name: { en: 'Defence', hi: '', mr: '' }, slug: 'defence', icon: 'Shield', isTrending: true, isQuickLink: false },
      { id: 'c12', name: { en: 'UPSC', hi: '', mr: '' }, slug: 'upsc', icon: 'Landmark', isTrending: true, isQuickLink: false }
    ];
    await fs.writeFile(CATEGORIES_DB, JSON.stringify(defaultCategories, null, 2));
  }

  // Init Settings
  try {
    await fs.access(SETTINGS_DB);
  } catch (error) {
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
    await fs.writeFile(SETTINGS_DB, JSON.stringify(defaultSettings, null, 2));
  }
}

export const getCategories = cache(async (): Promise<Category[]> => {
  await initDb();
  const data = await fs.readFile(CATEGORIES_DB, 'utf-8');
  return JSON.parse(data);
});

export async function saveCategories(categories: Category[]): Promise<void> {
  await fs.writeFile(CATEGORIES_DB, JSON.stringify(categories, null, 2));
}

export const getSettings = cache(async (): Promise<HomepageSettings> => {
  await initDb();
  const data = await fs.readFile(SETTINGS_DB, 'utf-8');
  return JSON.parse(data);
});

export async function saveSettings(settings: HomepageSettings): Promise<void> {
  await fs.writeFile(SETTINGS_DB, JSON.stringify(settings, null, 2));
}

export const getJobs = cache(async (): Promise<Job[]> => {
  await initDb();
  const data = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(data);
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
  const jobs = await getJobs();
  const newJob: Job = {
    ...job,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };
  jobs.unshift(newJob);
  await fs.writeFile(DB_PATH, JSON.stringify(jobs, null, 2));
  return newJob;
}

export async function updateJob(id: string, jobData: Partial<Job>): Promise<Job | null> {
  const jobs = await getJobs();
  const index = jobs.findIndex(j => j.id === id);
  if (index === -1) return null;
  
  const updatedJob = {
    ...jobs[index],
    ...jobData,
    updated_at: new Date().toISOString()
  };
  
  jobs[index] = updatedJob;
  await fs.writeFile(DB_PATH, JSON.stringify(jobs, null, 2));
  return updatedJob;
}

export async function deleteJob(id: string): Promise<boolean> {
  const jobs = await getJobs();
  const initialLength = jobs.length;
  const updatedJobs = jobs.filter(j => j.id !== id);
  
  if (updatedJobs.length === initialLength) {
    return false; // Job not found
  }
  
  await fs.writeFile(DB_PATH, JSON.stringify(updatedJobs, null, 2));
  return true;
}

export async function addJobComment(slug: string, comment: Omit<JobComment, 'id' | 'created_at'>): Promise<JobComment | null> {
  const jobs = await getJobs();
  const index = jobs.findIndex(j => j.slug === slug);
  if (index === -1) return null;

  const newComment: JobComment = {
    ...comment,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };

  if (!jobs[index].comments) {
    jobs[index].comments = [];
  }
  
  // Add to the beginning so newest is first
  jobs[index].comments.unshift(newComment);
  
  await fs.writeFile(DB_PATH, JSON.stringify(jobs, null, 2));
  return newComment;
}
