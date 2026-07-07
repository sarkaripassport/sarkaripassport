const fs = require('fs/promises');
const path = require('path');

async function main() {
  const file = path.join(process.cwd(), 'src', 'app', '[lang]', 'explore', '[...matrix]', 'page.tsx');
  let content = await fs.readFile(file, 'utf-8');

  const breadcrumbSchemaCode = `
  // Generate BreadcrumbList JSON-LD Schema
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': t.home,
        'item': \`https://sarkaripassport.com/\${lang}\`
      },
      ...displayTags.map((tag, idx) => ({
        '@type': 'ListItem',
        'position': idx + 2,
        'name': tag,
        'item': \`https://sarkaripassport.com/\${lang}/explore/\${matrix.slice(0, idx + 1).join('/')}\`
      }))
    ]
  };
`;
  
  content = content.replace(
    /const translations = \{/,
    `${breadcrumbSchemaCode}\n  const translations = {`
  );

  content = content.replace(
    /<main className="min-h-screen bg-gray-50 pt-\[70px\] pb-12">/,
    `<main className="min-h-screen bg-gray-50 pt-[70px] pb-12">\n      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />`
  );

  await fs.writeFile(file, content, 'utf-8');
}
main();
