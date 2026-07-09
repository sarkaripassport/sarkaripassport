import ComingSoon from '@/components/ui/ComingSoon';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Document Readiness | Coming Soon',
};

export default function Page() {
  return (
    <ComingSoon 
      title="Document Readiness" 
      description="Ensure you have the right file sizes, formats, and documents ready before applying for any Sarkari job." 
    />
  );
}
