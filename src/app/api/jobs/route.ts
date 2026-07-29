import { broadcastToTelegram, broadcastToWhatsApp } from '@/lib/distribution';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createJob, updateJob, getJobs } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { autoLinker } from '@/lib/autoLinkerHtml';
import { autoCategorize } from '@/lib/autoCategorizer';

import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (id) {
      const { data, error } = await supabaseAdmin
        .from('jobs')
        .select('id, slug, data')
        .eq('id', id)
        .single();
      if (error || !data) return NextResponse.json({ error: "Job not found" }, { status: 404 });
      
      const jobObject = {
        ...(data.data as any),
        id: data.id,
        slug: data.slug
      };
      return NextResponse.json(jobObject);
    }
    
    // Return all if no ID
    const jobs = await getJobs();
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const data = await req.json();
    
    if (user?.email) {
      data.created_by = user.email;
      data.last_edited_by = user.email;
    }
    
    // Sanitize or auto-generate slug
    if (data.slug) {
      data.slug = data.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    } else {
      const titleStr = typeof data.title === 'string' ? data.title : data.title?.en;
      data.slug = (titleStr || 'job-post').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    // Auto-convert string fields from admin editor into LocalizedString objects
    const localize = (val: any) => typeof val === 'string' ? { en: val, hi: '', mr: '' } : val;

    data.title = localize(data.title);
    data.organization = localize(data.organization);
    data.seo_title = localize(data.seo_title);
    data.seo_description = localize(data.seo_description);
    data.primary_keyword = localize(data.primary_keyword);
    data.secondary_keywords = localize(data.secondary_keywords);
    data.logo_alt = localize(data.logo_alt);
    data.job_summary = localize(data.job_summary);
    data.education_qualification = localize(data.education_qualification);
    data.salary_benefits = localize(data.salary_benefits);
    data.physical_standards = localize(data.physical_standards);

    if (data.quick_facts) {
      data.quick_facts.last_date = localize(data.quick_facts.last_date);
      data.quick_facts.qualification = localize(data.quick_facts.qualification);
      data.quick_facts.age_limit = localize(data.quick_facts.age_limit);
      data.quick_facts.job_location = localize(data.quick_facts.job_location);
      data.quick_facts.salary = localize(data.quick_facts.salary);
      data.quick_facts.application_mode = localize(data.quick_facts.application_mode);
    }


    // Sanitize SEO Matrix tags into URL-friendly slugs
    if (data.seo_matrix) {
      const toSlug = (arr: any) => Array.isArray(arr) ? arr.map(s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) : [];
      data.seo_matrix = {
        states: toSlug(data.seo_matrix.states),
        cities: toSlug(data.seo_matrix.cities),
        qualifications: toSlug(data.seo_matrix.qualifications),
        departments: toSlug(data.seo_matrix.departments)
      };
    }

    if (data.description_html) {
      data.description_html = autoLinker(data.description_html);
    }

    const categorizedData = autoCategorize(data);
    const job = await createJob(categorizedData as any);

    // Trigger Distribution Broadcasts
    if (data.broadcast_now) {
      // Async so we don't block the API response
      Promise.all([
        broadcastToTelegram(job, 'en'),
        broadcastToWhatsApp(job, 'en')
      ]).catch(e => console.error("Broadcast failed:", e));
    }

    // Bust the Next.js cache so new jobs are visible instantly
    revalidatePath('/', 'layout');

    // If running locally, ping the production Vercel server to bust its cache too
    if (process.env.NODE_ENV === 'development' && process.env.REVALIDATE_SECRET) {
      try {
        fetch(`https://govjobwala.com/api/revalidate?secret=${process.env.REVALIDATE_SECRET}`)
          .catch(e => console.error("Failed to ping production webhook:", e));
      } catch (e) {}
    }

    return NextResponse.json({ success: true, job }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save job" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: "Missing job ID" }, { status: 400 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const data = await req.json();

    if (user?.email) {
      data.last_edited_by = user.email;
    }

    const localize = (val: any) => typeof val === 'string' ? { en: val, hi: '', mr: '' } : val;
    if (data.title) data.title = localize(data.title);
    if (data.seo_title) data.seo_title = localize(data.seo_title);
    if (data.seo_description) data.seo_description = localize(data.seo_description);

    if (data.description_html) {
      data.description_html = autoLinker(data.description_html);
    }

    const categorizedData = autoCategorize(data);
    const job = await updateJob(id, categorizedData);
    
    // Bust the Next.js cache so changes are visible instantly
    revalidatePath('/', 'layout');

    // If running locally, ping the production Vercel server to bust its cache too
    if (process.env.NODE_ENV === 'development' && process.env.REVALIDATE_SECRET) {
      try {
        fetch(`https://govjobwala.com/api/revalidate?secret=${process.env.REVALIDATE_SECRET}`)
          .catch(e => console.error("Failed to ping production webhook:", e));
      } catch (e) {}
    }

    return NextResponse.json({ success: true, job }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}
