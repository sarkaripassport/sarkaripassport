import { supabaseAdmin } from './supabase/admin';

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

const defaultAnalytics: AnalyticsData = { jobs: {}, global: { daily: {}, weekly: {}, monthly: {}, total: 0 } };

export async function getAnalytics(): Promise<AnalyticsData> {
  try {
    const { data, error } = await supabaseAdmin.from('settings').select('data').eq('id', 'analytics').single();
    if (error || !data) return defaultAnalytics;
    return data.data as AnalyticsData;
  } catch (error) {
    return defaultAnalytics;
  }
}

export async function trackPageView(slug: string) {
  try {
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

    await supabaseAdmin.from('settings').upsert({ id: 'analytics', data: data });
  } catch (e) {
    console.error("Failed to track page view", e);
  }
}

