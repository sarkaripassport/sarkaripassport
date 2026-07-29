import { Job } from './db';

// Helper to extract clean string text from localized field or raw string
function extractText(val: any): string {
  if (!val) return '';
  if (typeof val === 'string') return val.toLowerCase();
  if (typeof val === 'object') {
    return [val.en, val.hi, val.mr].filter(Boolean).join(' ').toLowerCase();
  }
  return '';
}

export function autoCategorize(job: Partial<Job>): Partial<Job> {
  // Aggregate all text contents to scan
  const texts = [
    extractText(job.title),
    extractText(job.organization),
    extractText(job.job_summary),
    extractText(job.education_qualification),
    extractText(job.description_html)
  ];
  
  if (job.quick_facts) {
    texts.push(extractText(job.quick_facts.qualification));
    texts.push(extractText(job.quick_facts.job_location));
  }
  
  const fullText = texts.join(' ');

  // 1. Map Multiple Categories/Tags
  const categories = new Set<string>(job.categories || []);
  
  if (/\b(railway|rrb|ntpc|metro|loco pilot)\b/.test(fullText)) {
    categories.add('Railway Jobs');
  }
  if (/\b(bank|banking|sbi|ibps|rbi|pnb|hdfc|icici|clerk|po|cooperative)\b/.test(fullText)) {
    categories.add('Bank Jobs');
  }
  if (/\b(police|constable|sub inspector|jail warder|home guard|excise constable)\b/.test(fullText)) {
    categories.add('Police Jobs');
  }
  if (/\b(ssc|cgl|chsl|mts|cpo|je ssc)\b/.test(fullText)) {
    categories.add('SSC Jobs');
  }
  if (/\b(upsc|ias|ips|ifs|nda|cds)\b/.test(fullText)) {
    categories.add('UPSC Jobs');
  }
  if (/\b(army|navy|airforce|air force|defence|bsf|crpf|cisf|itbp|ssb|military|coast guard)\b/.test(fullText)) {
    categories.add('Defence Jobs');
  }
  if (/\b(teaching|teacher|tet|ctet|pgt|tgt|prt|school|college|professor|lecturer)\b/.test(fullText)) {
    categories.add('Teaching Jobs');
  }
  if (/\b(medical|nurse|doctor|pharmacist|hospital|health|anm|gnm|dentist|mbbs)\b/.test(fullText)) {
    categories.add('Medical Jobs');
  }

  // Update categories field
  job.categories = Array.from(categories);

  // 2. Map SEO Matrix Tags
  const matrix = job.seo_matrix || {
    states: [],
    cities: [],
    qualifications: [],
    departments: []
  };

  const states = new Set<string>(matrix.states || []);
  const cities = new Set<string>(matrix.cities || []);
  const qualifications = new Set<string>(matrix.qualifications || []);
  const departments = new Set<string>(matrix.departments || []);

  // -- States --
  if (/\b(maharashtra|mumbai|pune|nagpur|nashik|aurangabad|kolhapur|solapur|amravati|nanded)\b/.test(fullText)) {
    states.add('maharashtra');
  }
  if (/\b(uttar pradesh|uttarpradesh|up govt|lucknow|kanpur|varanasi|allahabad|agra|noida|ghaziabad)\b/.test(fullText)) {
    states.add('uttar-pradesh');
  }
  if (/\b(bihar|patna|gaya|muzaffarpur|bhagalpur|darbhanga|purnia)\b/.test(fullText)) {
    states.add('bihar');
  }
  if (/\b(delhi|new delhi|ncr)\b/.test(fullText)) {
    states.add('delhi');
  }
  if (/\b(rajasthan|jaipur|jodhpur|udaipur|kota|ajmer|bikaner)\b/.test(fullText)) {
    states.add('rajasthan');
  }
  if (/\b(madhya pradesh|madhyapradesh|mp govt|bhopal|indore|gwalior|jabalpur)\b/.test(fullText)) {
    states.add('madhya-pradesh');
  }
  if (/\b(gujarat|ahmedabad|surat|vadodara|rajkot|gandhinagar)\b/.test(fullText)) {
    states.add('gujarat');
  }

  // -- Cities --
  if (/\bmumbai\b/.test(fullText)) cities.add('mumbai');
  if (/\bpune\b/.test(fullText)) cities.add('pune');
  if (/\bnashik\b/.test(fullText)) cities.add('nashik');
  if (/\bnagpur\b/.test(fullText)) cities.add('nagpur');
  if (/\bdelhi\b/.test(fullText)) cities.add('delhi');
  if (/\blucknow\b/.test(fullText)) cities.add('lucknow');
  if (/\bpatna\b/.test(fullText)) cities.add('patna');

  // -- Qualifications --
  if (/\b(10th|matric|10 class|ssc pass|high school)\b/.test(fullText)) {
    qualifications.add('10th-pass');
  }
  if (/\b(12th|hsc|intermediate|12 class|10\+2)\b/.test(fullText)) {
    qualifications.add('12th-pass');
  }
  if (/\biti\b/.test(fullText)) {
    qualifications.add('iti-pass');
  }
  if (/\bdiploma\b/.test(fullText)) {
    qualifications.add('diploma');
  }
  if (/\b(degree|graduate|graduation|btech|b\.tech|bsc|b\.sc|ba|b\.a|bcom|b\.com|be|b\.e|bca|bba|mbbs)\b/.test(fullText)) {
    qualifications.add('graduate');
  }
  if (/\b(post graduate|postgraduate|pg|mtech|m\.tech|msc|m\.sc|ma|m\.a|mcom|m\.com|mba|mca)\b/.test(fullText)) {
    qualifications.add('post-graduate');
  }

  // -- Departments --
  if (/\b(railway|rrb|ntpc|metro|loco pilot)\b/.test(fullText)) {
    departments.add('railway');
  }
  if (/\b(bank|banking|sbi|ibps|rbi|pnb|hdfc|icici|clerk|po|cooperative)\b/.test(fullText)) {
    departments.add('banking');
  }
  if (/\b(police|constable|sub inspector|jail warder|home guard|excise constable)\b/.test(fullText)) {
    departments.add('police');
  }
  if (/\b(ssc|cgl|chsl|mts|cpo|je ssc)\b/.test(fullText)) {
    departments.add('ssc');
  }
  if (/\b(upsc|ias|ips|ifs|nda|cds)\b/.test(fullText)) {
    departments.add('upsc');
  }

  job.seo_matrix = {
    states: Array.from(states),
    cities: Array.from(cities),
    qualifications: Array.from(qualifications),
    departments: Array.from(departments)
  };

  return job;
}
