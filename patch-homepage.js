const fs = require('fs/promises');
const path = require('path');

async function fix() {
  const file = path.join(process.cwd(), 'src', 'app', 'admin', 'homepage', 'page.tsx');
  let content = await fs.readFile(file, 'utf-8');
  
  // replace all value={settings.seo...} and value={settings.hero...}
  content = content.replace(/value=\{settings\.seo\.title\}/g, "value={typeof settings.seo.title === 'string' ? settings.seo.title : settings.seo.title?.en || ''}");
  content = content.replace(/value=\{settings\.seo\.description\}/g, "value={typeof settings.seo.description === 'string' ? settings.seo.description : settings.seo.description?.en || ''}");
  content = content.replace(/value=\{settings\.seo\.keywords\}/g, "value={typeof settings.seo.keywords === 'string' ? settings.seo.keywords : settings.seo.keywords?.en || ''}");
  content = content.replace(/value=\{settings\.hero\.title\}/g, "value={typeof settings.hero.title === 'string' ? settings.hero.title : settings.hero.title?.en || ''}");
  content = content.replace(/value=\{settings\.hero\.subtitle\}/g, "value={typeof settings.hero.subtitle === 'string' ? settings.hero.subtitle : settings.hero.subtitle?.en || ''}");
  
  // replace onChange
  content = content.replace(/onChange=\{\(e\) => setSettings\(\{\.\.\.settings, seo: \{\.\.\.settings\.seo, title: e\.target\.value\}\}\)\}/g, "onChange={(e) => setSettings({...settings, seo: {...settings.seo, title: typeof settings.seo.title === 'string' ? {en: e.target.value, hi: '', mr: ''} : {...(settings.seo.title as any), en: e.target.value}}})}");
  
  content = content.replace(/onChange=\{\(e\) => setSettings\(\{\.\.\.settings, seo: \{\.\.\.settings\.seo, description: e\.target\.value\}\}\)\}/g, "onChange={(e) => setSettings({...settings, seo: {...settings.seo, description: typeof settings.seo.description === 'string' ? {en: e.target.value, hi: '', mr: ''} : {...(settings.seo.description as any), en: e.target.value}}})}");

  content = content.replace(/onChange=\{\(e\) => setSettings\(\{\.\.\.settings, seo: \{\.\.\.settings\.seo, keywords: e\.target\.value\}\}\)\}/g, "onChange={(e) => setSettings({...settings, seo: {...settings.seo, keywords: typeof settings.seo.keywords === 'string' ? {en: e.target.value, hi: '', mr: ''} : {...(settings.seo.keywords as any), en: e.target.value}}})}");

  content = content.replace(/onChange=\{\(e\) => setSettings\(\{\.\.\.settings, hero: \{\.\.\.settings\.hero, title: e\.target\.value\}\}\)\}/g, "onChange={(e) => setSettings({...settings, hero: {...settings.hero, title: typeof settings.hero.title === 'string' ? {en: e.target.value, hi: '', mr: ''} : {...(settings.hero.title as any), en: e.target.value}}})}");

  content = content.replace(/onChange=\{\(e\) => setSettings\(\{\.\.\.settings, hero: \{\.\.\.settings\.hero, subtitle: e\.target\.value\}\}\)\}/g, "onChange={(e) => setSettings({...settings, hero: {...settings.hero, subtitle: typeof settings.hero.subtitle === 'string' ? {en: e.target.value, hi: '', mr: ''} : {...(settings.hero.subtitle as any), en: e.target.value}}})}");

  // fix Announcements
  content = content.replace(/\{ id: \`a\$\{Date\.now\(\)\}\`, text: '',/g, "{ id: `a${Date.now()}`, text: { en: '', hi: '', mr: '' } as any,");
  
  content = content.replace(/value=\{ann\.text\}/g, "value={typeof ann.text === 'string' ? ann.text : (ann.text as any)?.en || ''}");
  
  content = content.replace(/onChange=\{\(e\) => updateAnnouncement\(ann\.id, 'text', e\.target\.value\)\}/g, "onChange={(e) => updateAnnouncement(ann.id, 'text', typeof ann.text === 'string' ? {en: e.target.value, hi: '', mr: ''} : {...(ann.text as any), en: e.target.value})}");

  // categories
  content = content.replace(/<option key=\{c\.slug\} value=\{c\.name\}>\{c\.name\}<\/option>/g, "<option key={c.slug} value={c.name.en}>{c.name.en}</option>");

  await fs.writeFile(file, content, 'utf-8');
}
fix();
