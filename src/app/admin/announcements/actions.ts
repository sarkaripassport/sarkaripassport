'use server';

import { updateJob, getSettings, saveSettings } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function toggleJobTrending(jobId: string, isTrending: boolean) {
  await updateJob(jobId, { isTrending });
  revalidatePath('/', 'layout');
}

export async function updateAnnouncements(announcements: any[]) {
  const settings = await getSettings();
  settings.announcements = announcements;
  await saveSettings(settings);
  revalidatePath('/', 'layout');
}
