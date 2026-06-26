import fs from 'fs/promises';
import path from 'path';

// Advanced Schema Types

export interface VacancyCard {
  post_name: string;
  total: string;
  education: string;
  age_limit?: string;
  salary?: string;
  categories: Record<string, string>; // e.g., UR: '10', OBC: '5'
}

export interface QuickFacts {
  vacancies: string;
  last_date: string;
  qualification: string;
  age_limit: string;
  job_location: string;
  salary: string;
  application_mode: string;
}

export interface EligibilityRule {
  id: string;
  condition: string; // e.g. "10th Pass", "Graduation"
  operator?: 'AND' | 'OR'; // logic to next rule
}

export interface AgeLimit {
  min_age: string;
  max_age: string;
  cutoff_date: string;
  relaxation: string;
}

export interface ApplicationFee {
  category: string;
  amount: string;
}

export interface TimelineEvent {
  label: string;
  date: string;
}

export interface SelectionStep {
  step_number: number;
  title: string;
  description: string;
}

export interface DocumentItem {
  id: string;
  item: string;
  is_required: boolean;
}

export interface ApplyStep {
  step_number: number;
  instruction: string;
}

export interface ImportantLink {
  label: string;
  url: string;
  is_primary?: boolean;
}

export interface JobFaq {
  question: string;
  answer: string;
}

export interface SimilarJob {
  title: string;
  slug: string;
  organization: string;
  last_date: string;
}

export interface Job {
  id: string;
  slug: string;
  title: string;
  organization: string;
  logo_url?: string;
  status: string;
  statusColor: string;
  isLive: boolean;
  isTrending: boolean;
  daysLeft: number;
  
  // SEO & Meta
  seo_title: string;
  seo_description: string;
  focus_keyword: string;
  seo_score: number;
  
  // Section 2: Quick Facts
  quick_facts: QuickFacts;
  
  // Section 3: Summary
  job_summary: string;
  
  // Section 4: Dates Timeline
  important_dates: TimelineEvent[];
  
  // Section 5 & 6: Fee & Age Limit
  application_fee: ApplicationFee[];
  age_limit: AgeLimit;
  
  // Section 7: Vacancy Details
  vacancy_cards: VacancyCard[];
  
  // Section 8: Education Qualification
  education_qualification: string; // HTML allowed
  
  // Section 9: Required Documents
  required_documents: DocumentItem[];
  
  // Section 10: Selection Process
  selection_process: SelectionStep[];
  
  // Section 11: Salary
  salary_benefits: string; // HTML allowed
  
  // Section 12: Physical Standards (Optional)
  physical_standards?: string; // HTML allowed
  
  // Section 13: How To Apply
  how_to_apply: ApplyStep[];
  
  // Section 14: Eligibility Builder
  eligibility_rules: EligibilityRule[];
  
  // Section 15: Similar Jobs
  similar_jobs: SimilarJob[];
  
  // Section 16: FAQs
  faqs: JobFaq[];
  
  // Section 17: Official Links
  important_links: ImportantLink[];
  
  category?: string; // Optional for backward compatibility, but UI will set it

  created_at: string;
}

const DB_PATH = path.join(process.cwd(), 'jobs-db.json');
const CATEGORIES_DB = path.join(process.cwd(), 'categories-db.json');
const SETTINGS_DB = path.join(process.cwd(), 'settings-db.json');

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  isTrending: boolean;
  isQuickLink: boolean;
}

export interface Announcement {
  id: string;
  text: string;
  link: string;
  isActive: boolean;
  priority: 'high' | 'normal';
}

export interface HomepageSettings {
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  hero: {
    title: string;
    subtitle: string;
  };
  four_columns: {
    col1_category: string;
    col2_category: string;
    col3_category: string;
    col4_category: string;
  };
  announcements: Announcement[];
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
        title: "UPSC Civil Services Examination 2026",
        organization: "Union Public Service Commission",
        logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1024px-Emblem_of_India.svg.png",
        status: "Active",
        statusColor: "text-green-800 bg-green-100 border-green-200",
        isLive: true,
        isTrending: true,
        daysLeft: 14,
        
        seo_title: "UPSC Civil Services (IAS/IPS) Notification 2026 - Apply Online",
        seo_description: "Apply online for 1,105 IAS, IPS, IFS vacancies under UPSC Civil Services 2026. Check eligibility, syllabus, and exam pattern.",
        focus_keyword: "UPSC Civil Services 2026",
        seo_score: 95,
        
        quick_facts: {
          vacancies: "1,105",
          last_date: "15 Jul 2026",
          qualification: "Graduation",
          age_limit: "21-32 Years",
          job_location: "All India",
          salary: "₹56,100 - ₹2,50,000",
          application_mode: "Online"
        },
        
        job_summary: "The Union Public Service Commission (UPSC) has published the Civil Services Examination 2026 notification to recruit 1,105 officers for IAS, IPS, IFS, and other central services. Eligible candidates holding a bachelor's degree can apply online before July 15, 2026.",
        
        important_dates: [
          { label: "Notification Released", date: "05 June 2026" },
          { label: "Online Application Starts", date: "05 June 2026" },
          { label: "Last Date to Apply", date: "15 July 2026" },
          { label: "Prelims Admit Card", date: "September 2026" },
          { label: "Prelims Exam", date: "26 September 2026" }
        ],
        
        application_fee: [
          { category: "General / OBC", amount: "₹100/-" },
          { category: "SC / ST / PwBD / Women", amount: "Exempted" }
        ],
        
        age_limit: {
          min_age: "21 Years",
          max_age: "32 Years",
          cutoff_date: "01/08/2026",
          relaxation: "OBC: 3 Years | SC/ST: 5 Years | PwBD: 10 Years"
        },
        
        vacancy_cards: [
          { post_name: "Indian Administrative Service (IAS)", total: "180", education: "Any Degree", categories: { UR: "73", OBC: "49", SC: "27", ST: "13", EWS: "18" } },
          { post_name: "Indian Police Service (IPS)", total: "200", education: "Any Degree", categories: { UR: "80", OBC: "54", SC: "30", ST: "15", EWS: "21" } },
          { post_name: "Indian Foreign Service (IFS)", total: "35", education: "Any Degree", categories: { UR: "16", OBC: "10", SC: "5", ST: "2", EWS: "2" } },
        ],
        
        education_qualification: "<p>Candidates must hold a degree of any of the Universities incorporated by an Act of the Central or State Legislature in India or other educational institutions established by an Act of Parliament or declared to be deemed as a University Under Section-3 of the University Grants Commission Act, 1956, or possess an equivalent qualification.</p>",
        
        required_documents: [
          { id: "d1", item: "Scanned Photograph (20-300 KB, JPG)", is_required: true },
          { id: "d2", item: "Scanned Signature (20-300 KB, JPG)", is_required: true },
          { id: "d3", item: "Photo ID Proof (Aadhaar/PAN/Voter ID)", is_required: true },
          { id: "d4", item: "Graduation Marksheet/Certificate", is_required: false },
          { id: "d5", item: "Category Certificate (if applicable)", is_required: true }
        ],
        
        selection_process: [
          { step_number: 1, title: "Preliminary Examination", description: "Objective type papers (GS Paper I & CSAT Paper II) for selection of candidates for the Main Examination." },
          { step_number: 2, title: "Main Examination", description: "Written examination consisting of 9 papers of conventional essay type." },
          { step_number: 3, title: "Interview / Personality Test", description: "Interview to assess the personal suitability of the candidate for a career in public service." }
        ],
        
        salary_benefits: "<p>The starting basic pay for IAS/IPS officers is ₹56,100 (Level 10 of Pay Matrix). Along with the basic pay, officers are entitled to Dearness Allowance (DA), House Rent Allowance (HRA), Transport Allowance (TA), and excellent perks including medical facilities, housing, and pension.</p>",
        
        how_to_apply: [
          { step_number: 1, instruction: "Visit the official UPSC online portal at upsc.gov.in." },
          { step_number: 2, instruction: "Complete the One Time Registration (OTR) if not already registered." },
          { step_number: 3, instruction: "Login using OTR ID and click on 'Apply Online' for Civil Services." },
          { step_number: 4, instruction: "Fill the application form, select exam center, and upload required documents." },
          { step_number: 5, instruction: "Pay the application fee and submit the final form. Take a printout." }
        ],
        
        eligibility_rules: [
          { id: "r1", condition: "Bachelor's Degree", operator: "AND" },
          { id: "r2", condition: "Age 21-32", operator: "OR" },
          { id: "r3", condition: "Age relaxation applicable for reserved categories" }
        ],
        
        similar_jobs: [
          { title: "SSC CGL 2026", slug: "ssc-cgl-2026", organization: "Staff Selection Commission", last_date: "24 Jun 2026" },
          { title: "IBPS PO 2026", slug: "ibps-po-2026", organization: "Institute of Banking Personnel Selection", last_date: "12 Aug 2026" }
        ],
        
        faqs: [
          { question: "Can final year students apply for UPSC CSE?", answer: "Yes, candidates in their final year of graduation can apply, provided they submit proof of passing the examination at the time of the Main Examination." },
          { question: "Is there a limit on the number of attempts?", answer: "Yes. General category candidates have 6 attempts. OBC candidates have 9 attempts. SC/ST candidates have unlimited attempts up to the age limit." }
        ],
        
        important_links: [
          { label: "Apply Online (OTR)", url: "https://upsconline.nic.in", is_primary: true },
          { label: "Download Notification", url: "#", is_primary: false },
          { label: "Official Website", url: "https://upsc.gov.in", is_primary: false }
        ],
        
        created_at: new Date().toISOString()
      }
    ];
    await fs.writeFile(DB_PATH, JSON.stringify(defaultData, null, 2));
  }

  // Init Categories
  try {
    await fs.access(CATEGORIES_DB);
  } catch (error) {
    const defaultCategories: Category[] = [
      { id: 'c1', name: 'Latest Jobs', slug: 'latest-jobs', icon: 'Briefcase', isTrending: false, isQuickLink: true },
      { id: 'c2', name: 'Admit Card', slug: 'admit-card', icon: 'FileText', isTrending: false, isQuickLink: true },
      { id: 'c3', name: 'Results', slug: 'results', icon: 'Award', isTrending: false, isQuickLink: true },
      { id: 'c4', name: 'Answer Key', slug: 'answer-key', icon: 'CheckCircle2', isTrending: false, isQuickLink: true },
      { id: 'c5', name: 'Syllabus', slug: 'syllabus', icon: 'GraduationCap', isTrending: false, isQuickLink: true },
      { id: 'c6', name: 'Admission', slug: 'admission', icon: 'Building2', isTrending: false, isQuickLink: true },
      { id: 'c7', name: 'SSC', slug: 'ssc', icon: 'Landmark', isTrending: true, isQuickLink: false },
      { id: 'c8', name: 'Railway', slug: 'railway', icon: 'Train', isTrending: true, isQuickLink: false },
      { id: 'c9', name: 'Bank', slug: 'bank', icon: 'Building2', isTrending: true, isQuickLink: false },
      { id: 'c10', name: 'Police', slug: 'police', icon: 'ShieldCheck', isTrending: true, isQuickLink: false },
      { id: 'c11', name: 'Defence', slug: 'defence', icon: 'Shield', isTrending: true, isQuickLink: false },
      { id: 'c12', name: 'UPSC', slug: 'upsc', icon: 'Landmark', isTrending: true, isQuickLink: false }
    ];
    await fs.writeFile(CATEGORIES_DB, JSON.stringify(defaultCategories, null, 2));
  }

  // Init Settings
  try {
    await fs.access(SETTINGS_DB);
  } catch (error) {
    const defaultSettings: HomepageSettings = {
      seo: {
        title: "SarkariJob - Latest Government Jobs, Results & Admit Cards",
        description: "Find the latest Sarkari jobs, admit cards, results, and syllabus updates. Check your eligibility and apply online instantly.",
        keywords: "sarkari job, sarkari result, admit card, latest govt jobs"
      },
      hero: {
        title: "Latest Government Jobs, Results, Admit Cards & Eligibility Updates",
        subtitle: "Create your Naukri Passport profile once and check your eligibility for every job instantly."
      },
      four_columns: {
        col1_category: "Admit Card",
        col2_category: "Results",
        col3_category: "Answer Key",
        col4_category: "Syllabus"
      },
      announcements: [
        { id: 'a1', text: "SSC CGL 2026 Notification Released - Apply Now!", link: "/jobs/ssc-cgl-2026", isActive: true, priority: "high" },
        { id: 'a2', text: "UPSC Civil Services Prelims Admit Card Available", link: "/jobs/upsc-civil-services-2026", isActive: true, priority: "normal" }
      ]
    };
    await fs.writeFile(SETTINGS_DB, JSON.stringify(defaultSettings, null, 2));
  }
}

export async function getCategories(): Promise<Category[]> {
  await initDb();
  const data = await fs.readFile(CATEGORIES_DB, 'utf-8');
  return JSON.parse(data);
}

export async function saveCategories(categories: Category[]): Promise<void> {
  await fs.writeFile(CATEGORIES_DB, JSON.stringify(categories, null, 2));
}

export async function getSettings(): Promise<HomepageSettings> {
  await initDb();
  const data = await fs.readFile(SETTINGS_DB, 'utf-8');
  return JSON.parse(data);
}

export async function saveSettings(settings: HomepageSettings): Promise<void> {
  await fs.writeFile(SETTINGS_DB, JSON.stringify(settings, null, 2));
}

export async function getJobs(): Promise<Job[]> {
  await initDb();
  const data = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(data);
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
