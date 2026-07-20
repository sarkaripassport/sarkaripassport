'use client';

import dynamic from 'next/dynamic';
import { Category } from '@/lib/db';
import { Locale } from '@/i18n/getDictionary';

const AdvancedSearch = dynamic(() => import("@/components/AdvancedSearch"), { ssr: false });

interface DynamicWidgetsProps {
  lang: Locale;
  categories: Category[];
}

export default function DynamicWidgets({ lang, categories }: DynamicWidgetsProps) {
  return (
    <>
      <AdvancedSearch lang={lang} categories={categories} />
    </>
  );
}
