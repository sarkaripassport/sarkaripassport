import "../globals.css";
import AdminClientShell from "./AdminClientShell";

export const metadata = {
  title: 'Admin Dashboard - Naukri Passport',
  description: 'Administration panel for Naukri Passport',
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
