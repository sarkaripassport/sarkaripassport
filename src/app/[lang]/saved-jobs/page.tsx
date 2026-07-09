import ComingSoon from '@/components/ui/ComingSoon';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Jobs | Coming Soon',
};

export default function Page() {
  return (
    <ComingSoon 
      title="Saved Jobs" 
      description="Bookmark your favorite jobs and quickly access their official notifications, syllabus, and application links." 
    />
  );
}
