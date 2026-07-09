import ComingSoon from '@/components/ui/ComingSoon';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admissions | Coming Soon',
  description: 'University and college admissions updates across India.',
};

export default function AdmissionPage() {
  return (
    <ComingSoon 
      title="University Admissions" 
      description="Get the latest updates on college and university admissions across India. We are bringing you a seamless tracking experience." 
    />
  );
}
