const fs = require('fs/promises');
const path = require('path');

async function main() {
  const file = path.join(process.cwd(), 'src', 'app', 'api', 'jobs', 'route.ts');
  let content = await fs.readFile(file, 'utf-8');

  // Insert seo_matrix sanitization before createJob
  const sanitizationCode = `
    // Sanitize SEO Matrix tags into URL-friendly slugs
    if (data.seo_matrix) {
      const toSlug = (arr: any) => Array.isArray(arr) ? arr.map(s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) : [];
      data.seo_matrix = {
        states: toSlug(data.seo_matrix.states),
        cities: toSlug(data.seo_matrix.cities),
        qualifications: toSlug(data.seo_matrix.qualifications),
        departments: toSlug(data.seo_matrix.departments)
      };
    }
`;
  
  content = content.replace(
    /    const job = await createJob\(data\);/,
    `${sanitizationCode}\n    const job = await createJob(data);`
  );

  await fs.writeFile(file, content, 'utf-8');
}
main();
