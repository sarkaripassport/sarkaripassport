import { cache } from 'react';
import { unstable_cache, revalidateTag } from 'next/cache';
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

export interface MatrixPage {
  slug: string; // e.g., 'upsc/mechanical-engineering'
  h1: LocalizedString;
  intro: LocalizedString;
  faqs?: { q: LocalizedString; a: LocalizedString }[];
}

export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  created_at: string;
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
  primary_keyword: LocalizedString;
  secondary_keywords?: LocalizedString;
  logo_alt?: LocalizedString;
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
  description_html?: string;
  
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
  created_by?: string;
  last_edited_by?: string;
}

export interface Category {
  id: string;
  name: LocalizedString;
  slug: string;
  icon: string;
  isTrending: boolean;
  isQuickLink: boolean;
  seo_title?: LocalizedString;
  seo_description?: LocalizedString;
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
  content_html?: LocalizedString;
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
  adsense?: {
    enabled?: boolean;
    client_id?: string;
    slot_header?: string;
    slot_sidebar?: string;
    slot_in_article?: string;
    auto_ads?: boolean;
    adsense_id?: string;
  };
  announcements: Announcement[];
  whatsapp_link?: string;
  analytics?: {
    ga_id?: string;
    gtm_id?: string;
    adsense_id?: string;
  };
  pages?: {
    [key: string]: PageSettings | undefined;
    'jobs'?: PageSettings;
    'latest-jobs'?: PageSettings;
    'admit-card'?: PageSettings;
    'results'?: PageSettings;
    'answer-key'?: PageSettings;
    'syllabus'?: PageSettings;
    'admission'?: PageSettings;
    'tools'?: PageSettings;
  };
  social_links?: {
    facebook?: string;
    twitter?: string;
    youtube?: string;
    telegram?: string;
    instagram?: string;
  };
  indexing?: {
    google_json?: string;
    indexnow_key?: string;
  };
  matrix_pages?: Record<string, MatrixPage>;
}

const defaultSettings: HomepageSettings = {
  seo: {
    title: { en: "GovJobWala - Latest Government Jobs, Results & Admit Cards", hi: "", mr: "" },
    description: { en: "Find the latest Sarkari jobs, admit cards, results, and syllabus updates. Check your eligibility and apply online instantly.", hi: "", mr: "" },
    keywords: { en: "sarkari job, sarkari result, admit card, latest govt jobs", hi: "", mr: "" },
    gscVerification: ""
  },
  analytics: {
    ga_id: "",
    gtm_id: "GTM-WQRKNNJW",
    adsense_id: ""
  },
  hero: {
    title: { en: "Latest Government Jobs, Results, Admit Cards & Eligibility Updates", hi: "", mr: "" },
    subtitle: { en: "Create your GovJobWala profile once and check your eligibility for every job instantly.", hi: "", mr: "" }
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
  whatsapp_link: "https://whatsapp.com/channel/0029VaA2KzV7T8bd5WEGk90n",
  social_links: {
    facebook: "https://facebook.com/govjobwala",
    twitter: "https://twitter.com/govjobwala",
    youtube: "https://youtube.com/@govjobwala",
    telegram: "https://t.me/govjobwala",
    instagram: "https://instagram.com/govjobwala"
  },

  pages: {
    'jobs': {
      seo: { title: { en: "Latest Government Jobs - GovJobWala", hi: "", mr: "" }, description: { en: "Browse all latest government job notifications across India", hi: "", mr: "" }, keywords: { en: "latest govt jobs, sarkari job", hi: "", mr: "" } },
      hero: { title: { en: "Latest Government Jobs", hi: "", mr: "" }, subtitle: { en: "Find and apply for all active government vacancies", hi: "", mr: "" } },
      content_html: { en: "", hi: "", mr: "" }
    },
    'admit-card': {
      seo: { title: { en: "Admit Cards - GovJobWala", hi: "", mr: "" }, description: { en: "Download latest admit cards", hi: "", mr: "" }, keywords: { en: "admit card", hi: "", mr: "" } },
      hero: { title: { en: "Download Admit Cards", hi: "", mr: "" }, subtitle: { en: "Get your hall tickets for upcoming exams", hi: "", mr: "" } },
      content_html: { en: "", hi: "", mr: "" }
    },
    'results': {
      seo: { title: { en: "Results - GovJobWala", hi: "", mr: "" }, description: { en: "Check latest exam results", hi: "", mr: "" }, keywords: { en: "results, exam results", hi: "", mr: "" } },
      hero: { title: { en: "Exam Results", hi: "", mr: "" }, subtitle: { en: "Check your selection status instantly", hi: "", mr: "" } },
      content_html: { en: "", hi: "", mr: "" }
    },
    'answer-key': {
      seo: { title: { en: "Answer Keys - GovJobWala", hi: "", mr: "" }, description: { en: "Download exam answer keys", hi: "", mr: "" }, keywords: { en: "answer key", hi: "", mr: "" } },
      hero: { title: { en: "Exam Answer Keys", hi: "", mr: "" }, subtitle: { en: "Verify your answers and calculate scores", hi: "", mr: "" } },
      content_html: { en: "", hi: "", mr: "" }
    },
    'syllabus': {
      seo: { title: { en: "Syllabus - GovJobWala", hi: "", mr: "" }, description: { en: "Download exam syllabus", hi: "", mr: "" }, keywords: { en: "syllabus", hi: "", mr: "" } },
      hero: { title: { en: "Exam Syllabus", hi: "", mr: "" }, subtitle: { en: "Prepare with the official syllabus", hi: "", mr: "" } },
      content_html: { en: "", hi: "", mr: "" }
    },
    'admission': {
      seo: { title: { en: "Admission Notifications - GovJobWala", hi: "", mr: "" }, description: { en: "Latest entrance exams and university admission notifications", hi: "", mr: "" }, keywords: { en: "admission, entrance exam", hi: "", mr: "" } },
      hero: { title: { en: "Admission Notifications", hi: "", mr: "" }, subtitle: { en: "Entrance exams, counseling, and admission updates", hi: "", mr: "" } },
      content_html: { en: "", hi: "", mr: "" }
    },
    'tools': {
      seo: { title: { en: "Online Tools for Govt Jobs - GovJobWala", hi: "", mr: "" }, description: { en: "Free online tools to resize passport photos, compress PDFs, merge signature and photos for government job application forms. 100% free and secure.", hi: "", mr: "" }, keywords: { en: "image resizer, photo and signature merge, compress pdf, online signature generator, govjobwala tools", hi: "", mr: "" } },
      hero: { title: { en: "Candidate Utility Tools", hi: "", mr: "" }, subtitle: { en: "Free online tools to format your photos, signatures, and documents for government job applications. Processed locally, 100% secure.", hi: "", mr: "" } },
      content_html: { en: "", hi: "", mr: "" }
    }
  }
};

export const getCategories = unstable_cache(async (): Promise<Category[]> => {
  const { data, error } = await supabaseAdmin.from('categories').select('data');
  if (error || !data) return [];
  return data.map(row => row.data as Category);
}, ['categories-cache'], { tags: ['categories'], revalidate: 3600 });

export async function saveCategories(categories: Category[]): Promise<void> {
  const rows = categories.map(c => ({ id: c.id, slug: c.slug, data: c }));
  await supabaseAdmin.from('categories').upsert(rows);
  revalidateTag('categories', 'default');
}

export const getSettings = unstable_cache(async (): Promise<HomepageSettings> => {
  const { data, error } = await supabaseAdmin.from('settings').select('data').eq('id', 'global').single();
  if (error || !data) return defaultSettings;
  return data.data as HomepageSettings;
}, ['settings-cache'], { tags: ['settings'], revalidate: 3600 });

export async function saveSettings(settings: HomepageSettings): Promise<void> {
  await supabaseAdmin.from('settings').upsert({ id: 'global', data: settings });
  revalidateTag('settings', 'default');
}

export const getJobs = unstable_cache(async (): Promise<Job[]> => {
  const { data, error } = await supabaseAdmin
    .from('jobs')
    .select(`
      id,
      slug,
      created_at,
      updated_at,
      title:data->title,
      organization:data->organization,
      category:data->category,
      categories:data->categories,
      status:data->status,
      statusColor:data->statusColor,
      isLive:data->isLive,
      isTrending:data->isTrending,
      logo_url:data->logo_url,
      logo_alt:data->logo_alt,
      quick_facts:data->quick_facts,
      seo_matrix:data->seo_matrix
    `)
    .order('created_at', { ascending: false });
    
  if (error || !data) {
    console.error('Error fetching jobs from Supabase:', error);
    return [];
  }
  return data as unknown as Job[];
}, ['jobs-cache'], { tags: ['jobs'], revalidate: 3600 });

export const getPublishedJobs = unstable_cache(async (): Promise<Job[]> => {
  const jobs = await getJobs();
  return jobs.filter(job => job.isLive === true);
}, ['published-jobs-cache'], { tags: ['jobs'], revalidate: 3600 });

export const getCategoriesWithCounts = unstable_cache(async (): Promise<(Category & { count: number })[]> => {
  const [categories, allJobs] = await Promise.all([
    getCategories(),
    getPublishedJobs()
  ]);
  
  const getCount = (catName: string) => allJobs.filter(j => j.category === catName || j.categories?.includes(catName)).length;
  
  return categories
    .map(c => ({
      ...c,
      count: getCount(c.name.en)
    }))
    .sort((a, b) => b.count - a.count);
}, ['categories-with-counts'], { tags: ['jobs', 'categories'], revalidate: 3600 });

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find(c => c.slug === slug) || null;
}

export async function getJobsByCategorySlug(slug: string): Promise<Job[]> {
  const jobs = await getPublishedJobs();
  const category = await getCategoryBySlug(slug);
  
  const searchString = category ? category.name.en.toLowerCase() : slug.toLowerCase().replace(/-/g, ' ');

  return jobs.filter(job => {
    if (job.category && job.category.toLowerCase() === searchString) return true;
    if (job.categories && job.categories.some(c => c.toLowerCase() === searchString)) return true;
    return false;
  });
}

export const getJobBySlug = cache(async (slug: string): Promise<Job | null> => {
  return unstable_cache(
    async () => {
      const { data, error } = await supabaseAdmin
        .from('jobs')
        .select('data')
        .eq('slug', slug)
        .single();
        
      if (error || !data) return null;
      return data.data as Job;
    },
    ['job-by-slug', slug],
    { tags: ['jobs', `job-${slug}`], revalidate: 3600 }
  )();
});

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
  
  revalidateTag('jobs', 'default');
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
  
  revalidateTag('jobs', 'default');
  return updatedJob;
}

export async function deleteJob(id: string): Promise<boolean> {
  try {
    // 1. Fetch the job details to extract logo URL
    const { data: jobRow } = await supabaseAdmin
      .from('jobs')
      .select('data')
      .eq('id', id)
      .single();

    if (jobRow && jobRow.data) {
      const logoUrl = jobRow.data.logo_url;
      if (logoUrl && typeof logoUrl === 'string' && logoUrl.includes('/storage/v1/object/public/uploads/')) {
        // Extract filename after '/uploads/'
        const match = logoUrl.match(/\/uploads\/(.+)$/);
        const filename = match ? match[1] : null;
        
        if (filename) {
          console.log(`🧹 Cleaning up storage: deleting logo file '${filename}'`);
          const { error: storageError } = await supabaseAdmin.storage
            .from('uploads')
            .remove([filename]);
            
          if (storageError) {
            console.error(`❌ Failed to delete storage file '${filename}':`, storageError.message);
          } else {
            console.log(`✅ Successfully deleted storage file '${filename}'`);
          }
        }
      }
    }
  } catch (err) {
    console.error('⚠️ Error performing storage cleanup for job deletion:', err);
  }

  // 2. Delete the row from the database
  const { error } = await supabaseAdmin.from('jobs').delete().eq('id', id);
  if (!error) revalidateTag('jobs', 'default');
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

// MOCK: Programmatic SEO Matrix Pages Database
const mockMatrixPages: Record<string, MatrixPage> = {
  'upsc/mechanical-engineering': {
    slug: 'upsc/mechanical-engineering',
    h1: {
      en: 'UPSC Recruitment for Mechanical Engineers 2026',
      hi: 'मैकेनिकल इंजीनियर्स के लिए यूपीएससी भर्ती 2026',
      mr: 'मेकॅनिकल इंजिनिअर्ससाठी UPSC भरती 2026'
    },
    intro: {
      en: 'Discover the latest and upcoming UPSC jobs specifically for Mechanical Engineering graduates. Find eligibility, syllabus, and apply online.',
      hi: 'मैकेनिकल इंजीनियरिंग स्नातकों के लिए नवीनतम और आगामी यूपीएससी नौकरियों की खोज करें।',
      mr: 'मेकॅनिकल इंजिनिअरिंग पदवीधरांसाठी नवीनतम आणि आगामी UPSC नोकऱ्या शोधा.'
    },
    faqs: [
      {
        q: { en: 'What is the age limit for UPSC Engineering Services?', hi: 'यूपीएससी इंजीनियरिंग सेवा के लिए आयु सीमा क्या है?', mr: 'UPSC अभियांत्रिकी सेवांसाठी वयोमर्यादा काय आहे?' },
        a: { en: 'The general age limit is 21 to 30 years. Relaxations apply for reserved categories.', hi: 'सामान्य आयु सीमा 21 से 30 वर्ष है। आरक्षित श्रेणियों के लिए छूट लागू है।', mr: 'सामान्य वयोमर्यादा 21 ते 30 वर्षे आहे. राखीव प्रवर्गांसाठी सवलत लागू आहे.' }
      }
    ]
  },
  '10th-pass/maharashtra': {
    slug: '10th-pass/maharashtra',
    h1: {
      en: '10th Pass Government Jobs in Maharashtra 2026',
      hi: 'महाराष्ट्र में 10वीं पास सरकारी नौकरियां 2026',
      mr: 'महाराष्ट्रात 10 वी पास सरकारी नोकऱ्या 2026'
    },
    intro: {
      en: 'Find thousands of 10th pass govt jobs in Maharashtra across Police, Railway, and State Departments.',
      hi: 'पुलिस, रेलवे और राज्य विभागों में महाराष्ट्र में हजारों 10वीं पास सरकारी नौकरियां खोजें।',
      mr: 'पोलीस, रेल्वे आणि राज्य विभागांमध्ये महाराष्ट्रात हजारो 10 वी पास सरकारी नोकऱ्या शोधा.'
    }
  }
};

export async function getMatrixPage(slug: string): Promise<MatrixPage | null> {
  const settings = await getSettings();
  if (settings.matrix_pages && settings.matrix_pages[slug]) {
    return settings.matrix_pages[slug];
  }
  return mockMatrixPages[slug] || null;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabaseAdmin.from('settings').select('data').like('id', 'msg_%');
  if (error || !data) return [];
  return data.map(row => row.data as ContactMessage).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function saveContactMessage(msg: ContactMessage): Promise<void> {
  await supabaseAdmin.from('settings').upsert({ id: msg.id, data: msg });
}
