import { getJobs, getSettings } from '@/lib/db';
import AnnouncementsClient from './AnnouncementsClient';

export default async function AnnouncementsAdminPage() {
  const jobs = await getJobs();
  const settings = await getSettings();
  
  return <AnnouncementsClient initialJobs={jobs} initialAnnouncements={settings.announcements || []} />;
}
