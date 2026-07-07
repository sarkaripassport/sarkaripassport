const fs = require('fs/promises');
const path = require('path');

async function main() {
  const file = path.join(process.cwd(), 'src', 'app', '[lang]', 'explore', '[...matrix]', 'page.tsx');
  let content = await fs.readFile(file, 'utf-8');

  // Remove the duplicate translations definition
  content = content.replace(
    /  const translations = \{\n    en: \{ home: 'Home', explore: 'Explore', jobs: 'Jobs', found: 'jobs found' \},\n    hi: \{ home: 'होम', explore: 'खोजें', jobs: 'नौकरियां', found: 'नौकरियां मिलीं' \},\n    mr: \{ home: 'मुख्यपृष्ठ', explore: 'शोधा', jobs: 'नोकऱ्या', found: 'नोकऱ्या सापडल्या' \}\n  \};\n  const t = translations\[lang\] \|\| translations\.en;\n/,
    ''
  );

  await fs.writeFile(file, content, 'utf-8');
}
main();
