const fs = require('fs/promises');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'jobs-db.json');

const newJobs = [
  {
    id: "2",
    slug: "ssc-chsl-2026",
    title: {
      en: "SSC CHSL Examination 2026",
      hi: "एसएससी सीएचएसएल परीक्षा 2026",
      mr: "एसएससी सीएचएसएल परीक्षा 2026"
    },
    organization: {
      en: "Staff Selection Commission",
      hi: "कर्मचारी चयन आयोग",
      mr: "कर्मचारी निवड आयोग"
    },
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1024px-Emblem_of_India.svg.png",
    status: "Active",
    statusColor: "text-green-800 bg-green-100 border-green-200",
    isLive: true,
    isTrending: true,
    daysLeft: 20,
    seo_title: {
      en: "SSC CHSL Notification 2026 - Apply Online",
      hi: "एसएससी सीएचएसएल अधिसूचना 2026 - ऑनलाइन आवेदन करें",
      mr: "एसएससी सीएचएसएल अधिसूचना 2026 - ऑनलाइन अर्ज करा"
    },
    seo_description: {
      en: "Apply online for SSC CHSL 2026 vacancies. Check eligibility, syllabus, and exam pattern.",
      hi: "एसएससी सीएचएसएल 2026 रिक्तियों के लिए ऑनलाइन आवेदन करें। पात्रता, पाठ्यक्रम और परीक्षा पैटर्न की जांच करें।",
      mr: "एसएससी सीएचएसएल 2026 रिक्त पदांसाठी ऑनलाइन अर्ज करा. पात्रता, अभ्यासक्रम आणि परीक्षा नमुना तपासा."
    },
    focus_keyword: {
      en: "SSC CHSL 2026",
      hi: "एसएससी सीएचएसएल 2026",
      mr: "एसएससी सीएचएसएल 2026"
    },
    seo_score: 90,
    quick_facts: {
      vacancies: "4,500",
      last_date: {
        en: "25 Jul 2026",
        hi: "25 जुलाई 2026",
        mr: "25 जुलै 2026"
      },
      qualification: {
        en: "12th Pass",
        hi: "12वीं पास",
        mr: "12वी उत्तीर्ण"
      },
      age_limit: {
        en: "18-27 Years",
        hi: "18-27 वर्ष",
        mr: "18-27 वर्षे"
      },
      job_location: {
        en: "All India",
        hi: "अखिल भारतीय",
        mr: "संपूर्ण भारत"
      },
      salary: {
        en: "₹19,900 - ₹81,100",
        hi: "₹19,900 - ₹81,100",
        mr: "₹19,900 - ₹81,100"
      },
      application_mode: {
        en: "Online",
        hi: "ऑनलाइन",
        mr: "ऑनलाइन"
      }
    },
    job_summary: {
      en: "Staff Selection Commission (SSC) has released the notification for Combined Higher Secondary Level (CHSL) 2026. Interested candidates can apply online.",
      hi: "कर्मचारी चयन आयोग (SSC) ने संयुक्त उच्चतर माध्यमिक स्तर (CHSL) 2026 के लिए अधिसूचना जारी की है। इच्छुक उम्मीदवार ऑनलाइन आवेदन कर सकते हैं।",
      mr: "कर्मचारी निवड आयोगाने (SSC) कंबाईंड हायर सेकंडरी लेव्हल (CHSL) 2026 साठी अधिसूचना जारी केली आहे. इच्छुक उमेदवार ऑनलाइन अर्ज करू शकतात."
    },
    important_dates: [
      {
        label: { en: "Notification Released", hi: "अधिसूचना जारी", mr: "अधिसूचना प्रसिद्ध" },
        date: { en: "15 June 2026", hi: "15 जून 2026", mr: "15 जून 2026" }
      },
      {
        label: { en: "Last Date to Apply", hi: "आवेदन की अंतिम तिथि", mr: "अर्ज करण्याची शेवटची तारीख" },
        date: { en: "25 July 2026", hi: "25 जुलाई 2026", mr: "25 जुलै 2026" }
      }
    ],
    application_fee: [
      {
        category: { en: "General / OBC", hi: "सामान्य / ओबीसी", mr: "सामान्य / ओबीसी" },
        amount: { en: "₹100", hi: "₹100", mr: "₹100" }
      },
      {
        category: { en: "SC / ST / Women", hi: "एससी / एसटी / महिलाएं", mr: "एससी / एसटी / महिला" },
        amount: { en: "Exempted", hi: "छूट", mr: "सूट" }
      }
    ],
    age_limit: {
      min_age: "18 Years",
      max_age: "27 Years",
      cutoff_date: "01/01/2026",
      relaxation: {
        en: "OBC: 3 Years | SC/ST: 5 Years",
        hi: "ओबीसी: 3 वर्ष | एससी/एसटी: 5 वर्ष",
        mr: "ओबीसी: 3 वर्षे | एससी/एसटी: 5 वर्षे"
      }
    },
    vacancy_cards: [
      {
        post_name: { en: "LDC / JSA", hi: "एलडीसी / जेएसए", mr: "एलडीसी / जेएसए" },
        total: "3,000",
        education: { en: "12th Pass", hi: "12वीं पास", mr: "12वी उत्तीर्ण" },
        categories: { UR: "1500", OBC: "800", SC: "500", ST: "200" }
      },
      {
        post_name: { en: "Data Entry Operator", hi: "डेटा एंट्री ऑपरेटर", mr: "डेटा एंट्री ऑपरेटर" },
        total: "1,500",
        education: { en: "12th Pass", hi: "12वीं पास", mr: "12वी उत्तीर्ण" },
        categories: { UR: "750", OBC: "400", SC: "250", ST: "100" }
      }
    ],
    education_qualification: {
      en: "Candidates must have passed 12th Standard or equivalent examination from a recognized Board or University.",
      hi: "उम्मीदवारों को किसी मान्यता प्राप्त बोर्ड या विश्वविद्यालय से 12वीं कक्षा या समकक्ष परीक्षा उत्तीर्ण होनी चाहिए।",
      mr: "उमेदवारांनी मान्यताप्राप्त मंडळ किंवा विद्यापीठातून 12 वी किंवा समतुल्य परीक्षा उत्तीर्ण केलेली असावी."
    },
    required_documents: [
      { id: "d1", item: { en: "Photo & Signature", hi: "फोटो और हस्ताक्षर", mr: "फोटो आणि स्वाक्षरी" }, is_required: true },
      { id: "d2", item: { en: "Aadhaar Card", hi: "आधार कार्ड", mr: "आधार कार्ड" }, is_required: true },
      { id: "d3", item: { en: "12th Marksheet", hi: "12वीं की मार्कशीट", mr: "12वी गुणपत्रिका" }, is_required: true }
    ],
    selection_process: [
      {
        step_number: 1,
        title: { en: "Tier I Exam", hi: "टियर I परीक्षा", mr: "टियर I परीक्षा" },
        description: { en: "Computer Based Examination.", hi: "कंप्यूटर आधारित परीक्षा।", mr: "संगणक आधारित परीक्षा." }
      },
      {
        step_number: 2,
        title: { en: "Tier II Exam", hi: "टियर II परीक्षा", mr: "टियर II परीक्षा" },
        description: { en: "Descriptive Paper & Skill Test.", hi: "वर्णनात्मक पेपर और कौशल परीक्षण।", mr: "वर्णनात्मक पेपर आणि कौशल्य चाचणी." }
      }
    ],
    salary_benefits: {
      en: "LDC/JSA: Pay Level-2 (Rs. 19,900-63,200). DEO: Pay Level-4 (Rs. 25,500-81,100).",
      hi: "LDC/JSA: वेतन स्तर-2 (रु. 19,900-63,200)। DEO: वेतन स्तर-4 (रु. 25,500-81,100)।",
      mr: "LDC/JSA: वेतन स्तर-2 (रु. 19,900-63,200). DEO: वेतन स्तर-4 (रु. 25,500-81,100)."
    },
    how_to_apply: [
      { step_number: 1, instruction: { en: "Visit ssc.gov.in", hi: "ssc.gov.in पर जाएं", mr: "ssc.gov.in ला भेट द्या" } },
      { step_number: 2, instruction: { en: "Register and Apply", hi: "पंजीकरण करें और आवेदन करें", mr: "नोंदणी करा आणि अर्ज करा" } }
    ],
    eligibility_rules: [
      { id: "r1", condition: { en: "12th Pass", hi: "12वीं पास", mr: "12वी उत्तीर्ण" }, operator: "AND" }
    ],
    similar_jobs: [],
    faqs: [
      {
        question: { en: "What is the age limit?", hi: "आयु सीमा क्या है?", mr: "वयोमर्यादा काय आहे?" },
        answer: { en: "18 to 27 years.", hi: "18 से 27 वर्ष।", mr: "18 ते 27 वर्षे." }
      }
    ],
    important_links: [
      { label: { en: "Apply Online", hi: "ऑनलाइन आवेदन करें", mr: "ऑनलाइन अर्ज करा" }, url: "https://ssc.nic.in", is_primary: true }
    ],
    category: "Latest Jobs",
    categories: ["Latest Jobs", "Admit Card", "SSC"],
    created_at: new Date().toISOString()
  },
  {
    id: "3",
    slug: "rrrb-ntpc-2026",
    title: {
      en: "RRB NTPC Recruitment 2026",
      hi: "आरआरबी एनटीपीसी भर्ती 2026",
      mr: "आरआरबी एनटीपीसी भरती 2026"
    },
    organization: {
      en: "Railway Recruitment Board",
      hi: "रेलवे भर्ती बोर्ड",
      mr: "रेल्वे भरती बोर्ड"
    },
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1024px-Emblem_of_India.svg.png",
    status: "Active",
    statusColor: "text-green-800 bg-green-100 border-green-200",
    isLive: true,
    isTrending: true,
    daysLeft: 10,
    seo_title: {
      en: "RRB NTPC Notification 2026 - Apply for 10000+ Posts",
      hi: "आरआरबी एनटीपीसी अधिसूचना 2026 - 10000+ पदों के लिए आवेदन करें",
      mr: "आरआरबी एनटीपीसी अधिसूचना 2026 - 10000+ पदांसाठी अर्ज करा"
    },
    seo_description: {
      en: "Railway Recruitment Board announces 10000+ NTPC vacancies for graduates and undergrads.",
      hi: "रेलवे भर्ती बोर्ड ने स्नातकों और स्नातक से नीचे के छात्रों के लिए 10000+ एनटीपीसी रिक्तियों की घोषणा की।",
      mr: "रेल्वे भरती बोर्डाने पदवीधर आणि पदवीधरांसाठी 10000+ एनटीपीसी रिक्त पदांची घोषणा केली."
    },
    focus_keyword: {
      en: "RRB NTPC 2026",
      hi: "आरआरबी एनटीपीसी 2026",
      mr: "आरआरबी एनटीपीसी 2026"
    },
    seo_score: 95,
    quick_facts: {
      vacancies: "10,000",
      last_date: {
        en: "05 Aug 2026",
        hi: "05 अगस्त 2026",
        mr: "05 ऑगस्ट 2026"
      },
      qualification: {
        en: "12th / Graduation",
        hi: "12वीं / स्नातक",
        mr: "12वी / पदवी"
      },
      age_limit: {
        en: "18-33 Years",
        hi: "18-33 वर्ष",
        mr: "18-33 वर्षे"
      },
      job_location: {
        en: "All India",
        hi: "अखिल भारतीय",
        mr: "संपूर्ण भारत"
      },
      salary: {
        en: "₹19,900 - ₹35,400",
        hi: "₹19,900 - ₹35,400",
        mr: "₹19,900 - ₹35,400"
      },
      application_mode: {
        en: "Online",
        hi: "ऑनलाइन",
        mr: "ऑनलाइन"
      }
    },
    job_summary: {
      en: "RRB has invited online applications for Non-Technical Popular Categories (NTPC) under Graduate and Undergraduate posts.",
      hi: "आरआरबी ने स्नातक और स्नातक से नीचे के पदों के तहत गैर-तकनीकी लोकप्रिय श्रेणियों (एनटीपीसी) के लिए ऑनलाइन आवेदन आमंत्रित किए हैं।",
      mr: "आरआरबी ने पदवीधर आणि अंडरग्रेजुएट पदांतर्गत नॉन-टेक्निकल पॉप्युलर कॅटेगरीज (NTPC) साठी ऑनलाइन अर्ज मागवले आहेत."
    },
    important_dates: [
      {
        label: { en: "Last Date", hi: "अंतिम तिथि", mr: "शेवटची तारीख" },
        date: { en: "05 Aug 2026", hi: "05 अगस्त 2026", mr: "05 ऑगस्ट 2026" }
      }
    ],
    application_fee: [
      {
        category: { en: "General / OBC", hi: "सामान्य / ओबीसी", mr: "सामान्य / ओबीसी" },
        amount: { en: "₹500", hi: "₹500", mr: "₹500" }
      },
      {
        category: { en: "SC / ST / ExSM", hi: "एससी / एसटी / पूर्व सैनिक", mr: "एससी / एसटी / माजी सैनिक" },
        amount: { en: "₹250", hi: "₹250", mr: "₹250" }
      }
    ],
    age_limit: {
      min_age: "18 Years",
      max_age: "33 Years",
      cutoff_date: "01/07/2026",
      relaxation: {
        en: "OBC: 3 Years | SC/ST: 5 Years",
        hi: "ओबीसी: 3 वर्ष | एससी/एसटी: 5 वर्ष",
        mr: "ओबीसी: 3 वर्षे | एससी/एसटी: 5 वर्षे"
      }
    },
    vacancy_cards: [
      {
        post_name: { en: "Station Master", hi: "स्टेशन मास्टर", mr: "स्टेशन मास्टर" },
        total: "2,500",
        education: { en: "Graduation", hi: "स्नातक", mr: "पदवी" },
        categories: { UR: "1000", OBC: "500" }
      },
      {
        post_name: { en: "Commercial Clerk", hi: "कमर्शियल क्लर्क", mr: "कमर्शियल क्लर्क" },
        total: "3,000",
        education: { en: "12th Pass", hi: "12वीं पास", mr: "12वी उत्तीर्ण" },
        categories: { UR: "1500", OBC: "750" }
      }
    ],
    education_qualification: {
      en: "Candidates must have 12th pass for under-graduate posts and Graduation for graduate level posts.",
      hi: "उम्मीदवारों के पास स्नातक स्तर के पदों के लिए स्नातक और स्नातक से नीचे के पदों के लिए 12वीं पास होना चाहिए।",
      mr: "उमेदवारांनी पदवीधर स्तरावरील पदांसाठी पदवी आणि अंडरग्रेजुएट पदांसाठी 12 वी उत्तीर्ण असावे."
    },
    required_documents: [],
    selection_process: [
      {
        step_number: 1,
        title: { en: "CBT 1", hi: "सीबीटी 1", mr: "CBT 1" },
        description: { en: "Computer Based Test", hi: "कंप्यूटर आधारित टेस्ट", mr: "संगणक आधारित चाचणी" }
      }
    ],
    salary_benefits: {
      en: "Level 2 to Level 6 Pay Matrix.",
      hi: "लेवल 2 से लेवल 6 वेतन मैट्रिक्स।",
      mr: "लेव्हल 2 ते लेव्हल 6 वेतन मॅट्रिक्स."
    },
    how_to_apply: [
      { step_number: 1, instruction: { en: "Visit RRB regional websites.", hi: "आरआरबी क्षेत्रीय वेबसाइटों पर जाएं।", mr: "RRB प्रादेशिक वेबसाइटला भेट द्या." } }
    ],
    eligibility_rules: [],
    similar_jobs: [],
    faqs: [],
    important_links: [
      { label: { en: "Apply Online", hi: "ऑनलाइन आवेदन करें", mr: "ऑनलाइन अर्ज करा" }, url: "https://rrbcdg.gov.in", is_primary: true }
    ],
    category: "Latest Jobs",
    categories: ["Latest Jobs", "Railway"],
    created_at: new Date().toISOString()
  },
  {
    id: "4",
    slug: "ibps-clerk-2026",
    title: {
      en: "IBPS Clerk Recruitment 2026",
      hi: "आईबीपीएस क्लर्क भर्ती 2026",
      mr: "IBPS क्लर्क भरती 2026"
    },
    organization: {
      en: "Institute of Banking Personnel Selection",
      hi: "बैंकिंग कार्मिक चयन संस्थान",
      mr: "बँकिंग कर्मचारी निवड संस्था"
    },
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1024px-Emblem_of_India.svg.png",
    status: "Active",
    statusColor: "text-green-800 bg-green-100 border-green-200",
    isLive: true,
    isTrending: false,
    daysLeft: 5,
    seo_title: {
      en: "IBPS Clerk 2026 Notification - Apply for 6000+ Posts",
      hi: "आईबीपीएस क्लर्क 2026 अधिसूचना - 6000+ पदों के लिए आवेदन करें",
      mr: "IBPS क्लर्क 2026 अधिसूचना - 6000+ पदांसाठी अर्ज करा"
    },
    seo_description: {
      en: "Apply online for IBPS Clerk CRP XIV vacancies.",
      hi: "आईबीपीएस क्लर्क सीआरपी XIV रिक्तियों के लिए ऑनलाइन आवेदन करें।",
      mr: "IBPS लिपिक CRP XIV रिक्त पदांसाठी ऑनलाइन अर्ज करा."
    },
    focus_keyword: {
      en: "IBPS Clerk 2026",
      hi: "आईबीपीएस क्लर्क 2026",
      mr: "IBPS क्लर्क 2026"
    },
    seo_score: 85,
    quick_facts: {
      vacancies: "6,000",
      last_date: {
        en: "12 Aug 2026",
        hi: "12 अगस्त 2026",
        mr: "12 ऑगस्ट 2026"
      },
      qualification: {
        en: "Graduation",
        hi: "स्नातक",
        mr: "पदवी"
      },
      age_limit: {
        en: "20-28 Years",
        hi: "20-28 वर्ष",
        mr: "20-28 वर्षे"
      },
      job_location: {
        en: "All India",
        hi: "अखिल भारतीय",
        mr: "संपूर्ण भारत"
      },
      salary: {
        en: "₹19,900 Basic",
        hi: "₹19,900 मूल वेतन",
        mr: "₹19,900 मूळ वेतन"
      },
      application_mode: {
        en: "Online",
        hi: "ऑनलाइन",
        mr: "ऑनलाइन"
      }
    },
    job_summary: {
      en: "IBPS has announced the recruitment of Clerks in participating banks.",
      hi: "आईबीपीएस ने भाग लेने वाले बैंकों में क्लर्कों की भर्ती की घोषणा की है।",
      mr: "IBPS ने सहभागी बँकांमध्ये लिपिकांच्या भरतीची घोषणा केली आहे."
    },
    important_dates: [
      {
        label: { en: "Last Date", hi: "अंतिम तिथि", mr: "शेवटची तारीख" },
        date: { en: "12 Aug 2026", hi: "12 अगस्त 2026", mr: "12 ऑगस्ट 2026" }
      }
    ],
    application_fee: [
      {
        category: { en: "General / OBC", hi: "सामान्य / ओबीसी", mr: "सामान्य / ओबीसी" },
        amount: { en: "₹850", hi: "₹850", mr: "₹850" }
      }
    ],
    age_limit: {
      min_age: "20 Years",
      max_age: "28 Years",
      cutoff_date: "01/07/2026",
      relaxation: {
        en: "OBC: 3 Years | SC/ST: 5 Years",
        hi: "ओबीसी: 3 वर्ष | एससी/एसटी: 5 वर्ष",
        mr: "ओबीसी: 3 वर्षे | एससी/एसटी: 5 वर्षे"
      }
    },
    vacancy_cards: [
      {
        post_name: { en: "Clerk", hi: "क्लर्क", mr: "लिपिक" },
        total: "6,000",
        education: { en: "Graduation", hi: "स्नातक", mr: "पदवी" },
        categories: { UR: "2500", OBC: "1500" }
      }
    ],
    education_qualification: {
      en: "Graduation in any discipline.",
      hi: "किसी भी विषय में स्नातक।",
      mr: "कोणत्याही शाखेतील पदवी."
    },
    required_documents: [],
    selection_process: [],
    salary_benefits: {
      en: "Basic pay Rs.19,900/-",
      hi: "मूल वेतन रु.19,900/-",
      mr: "मूळ वेतन रु.19,900/-"
    },
    how_to_apply: [],
    eligibility_rules: [],
    similar_jobs: [],
    faqs: [],
    important_links: [],
    category: "Latest Jobs",
    categories: ["Latest Jobs", "Bank", "Admit Card"],
    created_at: new Date().toISOString()
  }
];

async function seed() {
  const data = JSON.parse(await fs.readFile(DB_PATH, 'utf8'));
  const allJobs = [...newJobs, ...data]; // Add new jobs to the start
  await fs.writeFile(DB_PATH, JSON.stringify(allJobs, null, 2));
  console.log('Seeded 3 new multilingual jobs successfully.');
}

seed().catch(console.error);
