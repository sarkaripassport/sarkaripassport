const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/admin/editor/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Imports
content = content.replace(/import FloatingLinkToolbar from '@\/components\/admin\/FloatingLinkToolbar';\s*import { useTextSelection } from '@\/hooks\/useTextSelection';/, "import RichTextInput from '@/components/admin/RichTextInput';");

// 2. Remove Sidebar Hook Logic
content = content.replace(/\/\/ Selection hook for sidebar hyperlink tool([\s\S]*?)setSelection\(null\);\n  };\s*/, '');

// 3. Remove FloatingLinkToolbar
content = content.replace(/<FloatingLinkToolbar \/>/, '');

// 4. Replace textareas with RichTextInput
// job_summary
content = content.replace(
  /<textarea className="w-full border rounded p-2 h-24" value={jobData\.job_summary\?\.\[editLang\] \|\| ''} onChange={e => updateLocalizedField\('job_summary', e\.target\.value\)} \/>/,
  `<RichTextInput className="w-full border rounded p-2 min-h-[96px]" value={jobData.job_summary?.[editLang] || ''} onChange={val => updateLocalizedField('job_summary', val)} />`
);

// salary_benefits
content = content.replace(
  /<textarea className="w-full border rounded p-2 h-24" value={jobData\.salary_benefits\?\.\[editLang\] \|\| ''} onChange={e => updateLocalizedField\('salary_benefits', e\.target\.value\)} \/>/,
  `<RichTextInput className="w-full border rounded p-2 min-h-[96px]" value={jobData.salary_benefits?.[editLang] || ''} onChange={val => updateLocalizedField('salary_benefits', val)} />`
);

// vacancy_cards post_name
content = content.replace(
  /<textarea rows={2} className="w-full border border-gray-300 rounded p-2 text-sm" placeholder="Enter post name or HTML\.\.\." value={card\.post_name\?\.\[editLang\] \|\| ''} onChange={e => updateArrayItemLocalized\('vacancy_cards', index, 'post_name', e\.target\.value\)} \/>/,
  `<RichTextInput className="w-full border border-gray-300 rounded p-2 text-sm" placeholder="Enter post name..." value={card.post_name?.[editLang] || ''} onChange={val => updateArrayItemLocalized('vacancy_cards', index, 'post_name', val)} />`
);

// vacancy_cards education
content = content.replace(
  /<textarea rows={2} className="w-full border border-gray-300 rounded p-2 text-sm" placeholder="Enter education qualification\.\.\." value={card\.education\?\.\[editLang\] \|\| ''} onChange={e => updateArrayItemLocalized\('vacancy_cards', index, 'education', e\.target\.value\)} \/>/,
  `<RichTextInput className="w-full border border-gray-300 rounded p-2 text-sm" placeholder="Enter education qualification..." value={card.education?.[editLang] || ''} onChange={val => updateArrayItemLocalized('vacancy_cards', index, 'education', val)} />`
);

// selection_process description
content = content.replace(
  /<textarea placeholder="Description\.\.\." className="w-full border rounded p-2 text-sm" value={step\.description\?\.\[editLang\] \|\| ''} onChange={e => updateArrayItemLocalized\('selection_process', index, 'description', e\.target\.value\)} \/>/g,
  `<RichTextInput className="w-full border rounded p-2 text-sm" placeholder="Description..." value={step.description?.[editLang] || ''} onChange={val => updateArrayItemLocalized('selection_process', index, 'description', val)} />`
);

// faqs answer
content = content.replace(
  /<textarea placeholder="Answer" className="w-full border rounded p-2" value={faq\.answer\?\.\[editLang\] \|\| ''} onChange={e => updateArrayItemLocalized\('faqs', index, 'answer', e\.target\.value\)} \/>/g,
  `<RichTextInput className="w-full border rounded p-2" placeholder="Answer..." value={faq.answer?.[editLang] || ''} onChange={val => updateArrayItemLocalized('faqs', index, 'answer', val)} />`
);

// 5. Remove Sidebar Hyperlink Tool
content = content.replace(/\{\/\* Hyperlink Tool \*\/\}[\s\S]*?\{\/\* Breaking News Toggle \*\/\}/, '{/* Breaking News Toggle */}');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully migrated textareas to RichTextInput!');
