import ComingSoon from '@/components/ui/ComingSoon';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eligibility Checker | Coming Soon',
};

export default function Page() {
  return (
    <ComingSoon 
      title="Eligibility Checker" 
      description="Instantly check if you meet the age, qualification, and physical requirements for any government job." 
    />
  );
}
