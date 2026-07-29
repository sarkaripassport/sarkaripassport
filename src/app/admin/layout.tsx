import "../globals.css";
import AdminClientShell from "./AdminClientShell";

export const metadata = {
  title: 'Admin Dashboard - GovJobWala',
  description: 'Administration panel for GovJobWala',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AdminClientShell>
          {children}
        </AdminClientShell>
      </body>
    </html>
  );
}
