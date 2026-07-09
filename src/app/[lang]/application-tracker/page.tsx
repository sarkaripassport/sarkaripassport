import ComingSoon from '@/components/ui/ComingSoon';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Application Tracker | Coming Soon',
};

export default function Page() {
  return (
    <ComingSoon 
      title="Application Tracker" 
      description="Track the status of all your government job applications, exam dates, and admit card releases in one place." 
    />
  );
}
