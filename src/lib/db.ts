import fs from 'fs/promises';
import path from 'path';

export interface JobVacancy {
  name: string;
  education: string;
  vac: string;
}

export interface ImportantDate {
  label: string;
  date: string;
}

export interface ApplicationFee {
  category: string;
  amount: string;
}

export interface AgeLimit {
  min_age: string;
  max_age: string;
  cutoff_date: string;
  relaxation: string;
}

export interface ImportantLink {
  label: string;
  url: string;
}

export interface Job {
  id: string;
  slug: string;
  title: string;
  organization: string;
  last_date: string;
  status: string;
  statusColor: string;
  isLive: boolean;
  isTrending: boolean;
  daysLeft: number;
  total_vacancies: string;
  vacancies: JobVacancy[];
  important_dates?: ImportantDate[];
  application_fee?: ApplicationFee[];
  age_limit?: AgeLimit;
  important_links?: ImportantLink[];
  description_html: string;
  seo_title: string;
  seo_description: string;
  created_at: string;
}

const DB_PATH = path.join(process.cwd(), 'jobs-db.json');

// Initialize the database with dummy data if it doesn't exist
async function initDb() {
  try {
    await fs.access(DB_PATH);
  } catch (error) {
    const defaultData: Job[] = [
      {
        id: "1",
        slug: "ssc-cgl-2026",
        title: "SSC CGL 2026",
        organization: "Staff Selection Commission",
        last_date: "24 Jun 2026",
        status: "New",
        statusColor: "text-green-800 bg-green-100 border border-green-200",
        isLive: true,
        isTrending: true,
        daysLeft: 2,
        total_vacancies: "12,256",
        vacancies: [
          { name: "Assistant Section Officer (ASO)", education: "Bachelor's Degree in any stream", vac: "2,150" },
          { name: "Income Tax Inspector", education: "Bachelor's Degree in any stream", vac: "1,550" },
          { name: "Inspector (Central Excise)", education: "Bachelor's Degree in any stream", vac: "950" },
          { name: "Sub Inspector (CBI)", education: "Bachelor's Degree with 50% Marks", vac: "300" },
          { name: "Tax Assistant", education: "Bachelor's Degree + Typing Speed 8000 KDPH", vac: "4,000" }
        ],
        important_dates: [
          { label: "Application Begin", date: "01/05/2026" },
          { label: "Last Date for Apply Online", date: "24/06/2026" },
          { label: "Pay Exam Fee Last Date", date: "25/06/2026" },
          { label: "Correction Date", date: "27-28 June 2026" },
          { label: "Tier-I Exam Date", date: "August-September 2026" }
        ],
        application_fee: [
          { category: "General / OBC / EWS", amount: "₹100/-" },
          { category: "SC / ST / PH", amount: "₹0/-" },
          { category: "All Category Women", amount: "₹0/-" }
        ],
        age_limit: {
          min_age: "18 Years",
          max_age: "27-32 Years",
          cutoff_date: "01/08/2026",
          relaxation: "Age Relaxation Extra as per SSC CGL 2026 Rules."
        },
        important_links: [
          { label: "Apply Online", url: "#" },
          { label: "Download Notification", url: "#" },
          { label: "Official Website", url: "https://ssc.nic.in" }
        ],
        description_html: "<p>The Staff Selection Commission will hold the Combined Graduate Level Examination, 2026 for filling up of various Group ‘B’ and Group ‘C’ posts in different Ministries/ Departments/ Organizations of Government of India and various Constitutional Bodies/ Statutory Bodies/ Tribunals, etc. The details of the examination are as follows:</p>",
        seo_title: "SSC CGL 2026 Recruitment - Apply Online for 12,256 Posts",
        seo_description: "Staff Selection Commission has released the SSC CGL 2026 notification for 12,256 vacancies. Check eligibility, syllabus, and apply online.",
        created_at: new Date().toISOString()
      }
    ];
    await fs.writeFile(DB_PATH, JSON.stringify(defaultData, null, 2));
  }
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
  // Push at top to simulate 'latest'
  jobs.unshift(newJob);
  await fs.writeFile(DB_PATH, JSON.stringify(jobs, null, 2));
  return newJob;
}
