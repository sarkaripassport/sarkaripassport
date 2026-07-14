const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'src', 'app', '[lang]');

const pagesToUpdate = [
  { file: 'about/page.tsx', slug: '/about', title: 'About Us | GovJobWala', desc: 'Learn about GovJobWala - Your trusted companion for government jobs, results, admit cards, and eligibility checking.' },
  { file: 'contact/page.tsx', slug: '/contact', title: 'Contact Us | GovJobWala', desc: 'Get in touch with GovJobWala team.' },
  { file: 'privacy/page.tsx', slug: '/privacy', title: 'Privacy Policy | GovJobWala', desc: 'GovJobWala Privacy Policy' },
  { file: 'terms/page.tsx', slug: '/terms', title: 'Terms of Service | GovJobWala', desc: 'GovJobWala Terms of Service' },
  { file: 'disclaimer/page.tsx', slug: '/disclaimer', title: 'Disclaimer | GovJobWala', desc: 'GovJobWala Disclaimer' },
  { file: 'careers/page.tsx', slug: '/careers', title: 'Careers | GovJobWala', desc: 'Join the GovJobWala team.' },
  { file: 'press/page.tsx', slug: '/press', title: 'Press & Media | GovJobWala', desc: 'Press and media resources for GovJobWala.' }
];

for (const page of pagesToUpdate) {
  const filePath = path.join(baseDir, page.file);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // Remove existing static metadata if any
  content = content.replace(/export const metadata: Metadata = \{[\s\S]*?\};\n/g, '');
  content = content.replace(/import type \{ Metadata \} from "next";\n/g, '');

  const dynamicMetadata = `import { getSeoAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  return {
    title: "${page.title}",
    description: "${page.desc}",
    alternates: getSeoAlternates(lang, '${page.slug}')
  };
}
`;

  // Insert after the last import
  const lastImportIndex = content.lastIndexOf('import ');
  if (lastImportIndex !== -1) {
    const endOfImport = content.indexOf('\n', lastImportIndex) + 1;
    content = content.slice(0, endOfImport) + '\n' + dynamicMetadata + content.slice(endOfImport);
  } else {
    content = dynamicMetadata + '\n' + content;
  }

  fs.writeFileSync(filePath, content);
  console.log('Updated ' + page.file);
}
