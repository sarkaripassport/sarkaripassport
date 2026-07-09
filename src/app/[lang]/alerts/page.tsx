import ComingSoon from '@/components/ui/ComingSoon';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notification Alerts | Coming Soon',
};

export default function Page() {
  return (
    <ComingSoon 
      title="Notification Alerts" 
      description="Get instant WhatsApp and email alerts for jobs that match your exact qualifications and location preferences." 
    />
  );
}
