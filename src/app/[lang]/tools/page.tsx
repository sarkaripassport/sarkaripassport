import ComingSoon from '@/components/ui/ComingSoon';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tools | Coming Soon',
  description: 'Powerful calculators and tools for government job aspirants.',
};

export default function ToolsPage() {
  return (
    <ComingSoon 
      title="Student Tools" 
      description="Powerful calculators, age validators, and eligibility checking tools designed specifically for government job aspirants." 
    />
  );
}
