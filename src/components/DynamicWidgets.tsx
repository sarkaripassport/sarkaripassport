'use client';

import dynamic from 'next/dynamic';
import { Category } from '@/lib/db';
import { Locale } from '@/i18n/getDictionary';

const AspirantDashboard = dynamic(() => import("@/components/AspirantDashboard"), { ssr: false });
const AdvancedSearch = dynamic(() => import("@/components/AdvancedSearch"), { ssr: false });

interface DynamicWidgetsProps {
  lang: Locale;
  categories: Category[];
}

export default function DynamicWidgets({ lang, categories }: DynamicWidgetsProps) {
  return (
    <>
      <AspirantDashboard lang={lang} />
      <AdvancedSearch lang={lang} categories={categories} />
    </>
  );
}
