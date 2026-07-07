import fs from 'fs/promises';
import path from 'path';

export interface PageViews {
  daily: Record<string, number>; // "YYYY-MM-DD" -> count
  weekly: Record<string, number>; // "YYYY-WW" -> count
  monthly: Record<string, number>; // "YYYY-MM" -> count
  total: number;
}

export interface AnalyticsData {
  jobs: Record<string, PageViews>; // slug -> PageViews
  global: PageViews;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'analytics.json');

const getISOWeek = (date: Date) => {
  const tdt = new Date(date.valueOf());
  const dayn = (date.getDay() + 6) % 7;
  tdt.setDate(tdt.getDate() - dayn + 3);
  const firstThursday = tdt.valueOf();
  tdt.setMonth(0, 1);
  if (tdt.getDay() !== 4) {
    tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - tdt.valueOf()) / 604800000);
}

export async function getAnalytics(): Promise<AnalyticsData> {
  try {
    const data = await fs.readFile(FILE_PATH, 'utf-8');
    return JSON.parse(data) as AnalyticsData;
  } catch (error) {
    return { jobs: {}, global: { daily: {}, weekly: {}, monthly: {}, total: 0 } };
  }
}

export async function trackPageView(slug: string) {
  const data = await getAnalytics();
  
  const now = new Date();
  const dayKey = now.toISOString().split('T')[0];
  const monthKey = dayKey.substring(0, 7);
  const weekKey = `${now.getFullYear()}-W${getISOWeek(now)}`;

  if (!data.jobs[slug]) {
    data.jobs[slug] = { daily: {}, weekly: {}, monthly: {}, total: 0 };
  }

  // Increment Job Views
  data.jobs[slug].daily[dayKey] = (data.jobs[slug].daily[dayKey] || 0) + 1;
  data.jobs[slug].weekly[weekKey] = (data.jobs[slug].weekly[weekKey] || 0) + 1;
  data.jobs[slug].monthly[monthKey] = (data.jobs[slug].monthly[monthKey] || 0) + 1;
  data.jobs[slug].total += 1;

  // Increment Global Views
  data.global.daily[dayKey] = (data.global.daily[dayKey] || 0) + 1;
  data.global.weekly[weekKey] = (data.global.weekly[weekKey] || 0) + 1;
  data.global.monthly[monthKey] = (data.global.monthly[monthKey] || 0) + 1;
  data.global.total += 1;

  // Cleanup old daily/weekly data if necessary (to prevent infinite growth in a simple JSON file)
  // For now, keep it simple.

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2));
}
