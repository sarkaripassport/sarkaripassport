import ComingSoon from '@/components/ui/ComingSoon';
import type { Metadata } from 'next';
import { getDictionary, Locale } from "@/i18n/getDictionary";
import { getSeoAlternates } from "@/lib/seo";

export const revalidate = 3600;

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'hi' }, { lang: 'mr' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  return {
    title: "Admission | GovJobWala",
    alternates: getSeoAlternates(lang, '/admission')
  };
}

export default async function AdmissionPage({ params }: { params: Promise<{ lang: Locale }> }) {
  return (
    <ComingSoon 
      title="University Admissions" 
      description="Get the latest updates on college and university admissions across India. We are bringing you a seamless tracking experience." 
    />
  );
}
