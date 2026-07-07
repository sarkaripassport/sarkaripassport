const { createClient } = require('@supabase/supabase-js');

async function getEnv() {
  const fs = require('fs/promises');
  const envFile = await fs.readFile('.env.local', 'utf-8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val.length > 0) {
      env[key.trim()] = val.join('=').trim();
    }
  });
  return env;
}

async function seed() {
  const env = await getEnv();
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  const premiumJob = {
    id: "1",
    slug: "upsc-civil-services-2026",
    title: { en: "UPSC Civil Services Examination 2026", hi: "", mr: "" },
    organization: { en: "Union Public Service Commission", hi: "", mr: "" },
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1024px-Emblem_of_India.svg.png",
    status: "Active",
    statusColor: "text-green-800 bg-green-100 border-green-200",
    isLive: true,
    isTrending: true,
    daysLeft: 14,
    
    seo_title: { en: "UPSC Civil Services (IAS/IPS) Notification 2026 - Apply Online", hi: "", mr: "" },
    seo_description: { en: "Apply online for 1,105 IAS, IPS, IFS vacancies under UPSC Civil Services 2026. Check eligibility, syllabus, and exam pattern.", hi: "", mr: "" },
    focus_keyword: { en: "UPSC Civil Services 2026", hi: "", mr: "" },
    seo_score: 95,
    
    quick_facts: {
      vacancies: "1,105",
      last_date: { en: "15 Jul 2026", hi: "", mr: "" },
      qualification: { en: "Graduation", hi: "", mr: "" },
      age_limit: { en: "21-32 Years", hi: "", mr: "" },
      job_location: { en: "All India", hi: "", mr: "" },
      salary: { en: "₹56,100 - ₹2,50,000", hi: "", mr: "" },
      application_mode: { en: "Online", hi: "", mr: "" }
    },
    
    job_summary: { en: "The Union Public Service Commission (UPSC) has published the Civil Services Examination 2026 notification to recruit 1,105 officers for IAS, IPS, IFS, and other central services. Eligible candidates holding a bachelor's degree can apply online before July 15, 2026.", hi: "", mr: "" },
    
    important_dates: [
      { label: { en: "Notification Released", hi: "", mr: "" }, date: { en: "05 June 2026", hi: "", mr: "" } },
      { label: { en: "Online Application Starts", hi: "", mr: "" }, date: { en: "05 June 2026", hi: "", mr: "" } },
      { label: { en: "Last Date to Apply", hi: "", mr: "" }, date: { en: "15 July 2026", hi: "", mr: "" } },
      { label: { en: "Prelims Admit Card", hi: "", mr: "" }, date: { en: "September 2026", hi: "", mr: "" } },
      { label: { en: "Prelims Exam", hi: "", mr: "" }, date: { en: "26 September 2026", hi: "", mr: "" } }
    ],
    
    application_fee: [
      { category: { en: "General / OBC", hi: "", mr: "" }, amount: { en: "₹100/-", hi: "", mr: "" } },
      { category: { en: "SC / ST / PwBD / Women", hi: "", mr: "" }, amount: { en: "Exempted", hi: "", mr: "" } }
    ],
    
    age_limit: {
      min_age: "21 Years",
      max_age: "32 Years",
      cutoff_date: "01/08/2026",
      relaxation: { en: "OBC: 3 Years | SC/ST: 5 Years | PwBD: 10 Years", hi: "", mr: "" }
    },
    
    vacancy_cards: [
      { post_name: { en: "Indian Administrative Service (IAS)", hi: "", mr: "" }, total: "180", education: { en: "Any Degree", hi: "", mr: "" }, categories: { UR: "73", OBC: "49", SC: "27", ST: "13", EWS: "18" } },
      { post_name: { en: "Indian Police Service (IPS)", hi: "", mr: "" }, total: "200", education: { en: "Any Degree", hi: "", mr: "" }, categories: { UR: "80", OBC: "54", SC: "30", ST: "15", EWS: "21" } },
      { post_name: { en: "Indian Foreign Service (IFS)", hi: "", mr: "" }, total: "35", education: { en: "Any Degree", hi: "", mr: "" }, categories: { UR: "16", OBC: "10", SC: "5", ST: "2", EWS: "2" } },
    ],
    
    education_qualification: { en: "<p>Candidates must hold a degree of any of the Universities incorporated by an Act of the Central or State Legislature in India or other educational institutions established by an Act of Parliament or declared to be deemed as a University Under Section-3 of the University Grants Commission Act, 1956, or possess an equivalent qualification.</p>", hi: "", mr: "" },
    
    required_documents: [
      { id: "d1", item: { en: "Scanned Photograph (20-300 KB, JPG)", hi: "", mr: "" }, is_required: true },
      { id: "d2", item: { en: "Scanned Signature (20-300 KB, JPG)", hi: "", mr: "" }, is_required: true },
      { id: "d3", item: { en: "Photo ID Proof (Aadhaar/PAN/Voter ID)", hi: "", mr: "" }, is_required: true },
      { id: "d4", item: { en: "Graduation Marksheet/Certificate", hi: "", mr: "" }, is_required: false },
      { id: "d5", item: { en: "Category Certificate (if applicable)", hi: "", mr: "" }, is_required: true }
    ],
    
    selection_process: [
      { step_number: 1, title: { en: "Preliminary Examination", hi: "", mr: "" }, description: { en: "Objective type papers (GS Paper I & CSAT Paper II) for selection of candidates for the Main Examination.", hi: "", mr: "" } },
      { step_number: 2, title: { en: "Main Examination", hi: "", mr: "" }, description: { en: "Written examination consisting of 9 papers of conventional essay type.", hi: "", mr: "" } },
      { step_number: 3, title: { en: "Interview / Personality Test", hi: "", mr: "" }, description: { en: "Interview to assess the personal suitability of the candidate for a career in public service.", hi: "", mr: "" } }
    ],
    
    salary_benefits: { en: "<p>The starting basic pay for IAS/IPS officers is ₹56,100 (Level 10 of Pay Matrix). Along with the basic pay, officers are entitled to Dearness Allowance (DA), House Rent Allowance (HRA), Transport Allowance (TA), and excellent perks including medical facilities, housing, and pension.</p>", hi: "", mr: "" },
    
    how_to_apply: [
      { step_number: 1, instruction: { en: "Visit the official UPSC online portal at upsc.gov.in.", hi: "", mr: "" } },
      { step_number: 2, instruction: { en: "Complete the One Time Registration (OTR) if not already registered.", hi: "", mr: "" } },
      { step_number: 3, instruction: { en: "Login using OTR ID and click on 'Apply Online' for Civil Services.", hi: "", mr: "" } },
      { step_number: 4, instruction: { en: "Fill the application form, select exam center, and upload required documents.", hi: "", mr: "" } },
      { step_number: 5, instruction: { en: "Pay the application fee and submit the final form. Take a printout.", hi: "", mr: "" } }
    ],
    
    eligibility_rules: [
      { id: "r1", condition: { en: "Bachelor's Degree", hi: "", mr: "" }, operator: "AND" },
      { id: "r2", condition: { en: "Age 21-32", hi: "", mr: "" }, operator: "OR" },
      { id: "r3", condition: { en: "Age relaxation applicable for reserved categories", hi: "", mr: "" } }
    ],
    
    similar_jobs: [
      { title: { en: "SSC CGL 2026", hi: "", mr: "" }, slug: "ssc-cgl-2026", organization: { en: "Staff Selection Commission", hi: "", mr: "" }, last_date: { en: "24 Jun 2026", hi: "", mr: "" } },
      { title: { en: "IBPS PO 2026", hi: "", mr: "" }, slug: "ibps-po-2026", organization: { en: "Institute of Banking Personnel Selection", hi: "", mr: "" }, last_date: { en: "12 Aug 2026", hi: "", mr: "" } }
    ],
    
    faqs: [
      { question: { en: "Can final year students apply for UPSC CSE?", hi: "", mr: "" }, answer: { en: "Yes, candidates in their final year of graduation can apply, provided they submit proof of passing the examination at the time of the Main Examination.", hi: "", mr: "" } },
      { question: { en: "Is there a limit on the number of attempts?", hi: "", mr: "" }, answer: { en: "Yes. General category candidates have 6 attempts. OBC candidates have 9 attempts. SC/ST candidates have unlimited attempts up to the age limit.", hi: "", mr: "" } }
    ],
    
    important_links: [
      { label: { en: "Apply Online (OTR)", hi: "", mr: "" }, url: "https://upsconline.nic.in", is_primary: true },
      { label: { en: "Download Notification", hi: "", mr: "" }, url: "#", is_primary: false },
      { label: { en: "Official Website", hi: "", mr: "" }, url: "https://upsc.gov.in", is_primary: false }
    ],
    
    category: "Latest Jobs",
    categories: ["Latest Jobs", "Admit Card", "UPSC"],
    
    syllabus: [
      {
        subject: { en: "General Studies Paper I", hi: "", mr: "" },
        topics: [
          { title: { en: "History of India and Indian National Movement", hi: "", mr: "" } },
          { title: { en: "Indian and World Geography", hi: "", mr: "" } },
          { title: { en: "Indian Polity and Governance", hi: "", mr: "" } }
        ]
      }
    ],

    seo_matrix: {
      states: ["Delhi", "Maharashtra", "Uttar Pradesh"],
      cities: ["New Delhi", "Mumbai"],
      qualifications: ["Any Degree", "Graduation"],
      departments: ["UPSC", "IAS", "IPS"]
    },

    schema_settings: {
      enable_job_schema: true,
      enable_faq_schema: true,
      enable_syllabus_schema: true
    },

    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  };

  const jobRow = {
    id: premiumJob.id,
    slug: premiumJob.slug,
    created_at: premiumJob.created_at,
    updated_at: premiumJob.updated_at,
    data: premiumJob
  };

  console.log("Seeding Premium UPSC Job...");
  const { error } = await supabase.from('jobs').upsert([jobRow]);
  
  if (error) {
    console.error("Error seeding job:", error);
  } else {
    console.log("Seed successful!");
  }
}

seed();
