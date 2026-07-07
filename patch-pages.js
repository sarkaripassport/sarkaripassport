const fs = require('fs/promises');
const path = require('path');

async function fix() {
  const file = path.join(process.cwd(), 'src', 'app', 'admin', 'pages', 'page.tsx');
  let content = await fs.readFile(file, 'utf-8');
  
  // replace all value={currentPageData.seo...} and value={currentPageData.hero...}
  content = content.replace(/value=\{currentPageData\.seo\.title\}/g, "value={typeof currentPageData.seo.title === 'string' ? currentPageData.seo.title : currentPageData.seo.title?.en || ''}");
  content = content.replace(/value=\{currentPageData\.seo\.description\}/g, "value={typeof currentPageData.seo.description === 'string' ? currentPageData.seo.description : currentPageData.seo.description?.en || ''}");
  content = content.replace(/value=\{currentPageData\.seo\.keywords\}/g, "value={typeof currentPageData.seo.keywords === 'string' ? currentPageData.seo.keywords : currentPageData.seo.keywords?.en || ''}");
  content = content.replace(/value=\{currentPageData\.hero\.title\}/g, "value={typeof currentPageData.hero.title === 'string' ? currentPageData.hero.title : currentPageData.hero.title?.en || ''}");
  content = content.replace(/value=\{currentPageData\.hero\.subtitle\}/g, "value={typeof currentPageData.hero.subtitle === 'string' ? currentPageData.hero.subtitle : currentPageData.hero.subtitle?.en || ''}");
  
  // replace onChange
  content = content.replace(/onChange=\{\(e\) => updatePageSettings\('seo', 'title', e\.target\.value\)\}/g, "onChange={(e) => updatePageSettings('seo', 'title', typeof currentPageData.seo.title === 'string' ? {en: e.target.value, hi: '', mr: ''} : {...(currentPageData.seo.title as any), en: e.target.value})}");
  
  content = content.replace(/onChange=\{\(e\) => updatePageSettings\('seo', 'description', e\.target\.value\)\}/g, "onChange={(e) => updatePageSettings('seo', 'description', typeof currentPageData.seo.description === 'string' ? {en: e.target.value, hi: '', mr: ''} : {...(currentPageData.seo.description as any), en: e.target.value})}");

  content = content.replace(/onChange=\{\(e\) => updatePageSettings\('seo', 'keywords', e\.target\.value\)\}/g, "onChange={(e) => updatePageSettings('seo', 'keywords', typeof currentPageData.seo.keywords === 'string' ? {en: e.target.value, hi: '', mr: ''} : {...(currentPageData.seo.keywords as any), en: e.target.value})}");

  content = content.replace(/onChange=\{\(e\) => updatePageSettings\('hero', 'title', e\.target\.value\)\}/g, "onChange={(e) => updatePageSettings('hero', 'title', typeof currentPageData.hero.title === 'string' ? {en: e.target.value, hi: '', mr: ''} : {...(currentPageData.hero.title as any), en: e.target.value})}");

  content = content.replace(/onChange=\{\(e\) => updatePageSettings\('hero', 'subtitle', e\.target\.value\)\}/g, "onChange={(e) => updatePageSettings('hero', 'subtitle', typeof currentPageData.hero.subtitle === 'string' ? {en: e.target.value, hi: '', mr: ''} : {...(currentPageData.hero.subtitle as any), en: e.target.value})}");

  await fs.writeFile(file, content, 'utf-8');
}
fix();
