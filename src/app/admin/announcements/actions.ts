'use server';

import { updateJob, getSettings, saveSettings } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';

export async function toggleJobTrending(jobId: string, isTrending: boolean) {
  await requireAdmin();
  await updateJob(jobId, { isTrending });
  revalidatePath('/', 'layout');
}

export async function updateAnnouncements(announcements: any[]) {
  await requireAdmin();
  const settings = await getSettings();
  settings.announcements = announcements;
  await saveSettings(settings);
  revalidatePath('/', 'layout');
}
