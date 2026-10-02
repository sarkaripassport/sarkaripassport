export interface CanonicalTag {
  name: {
    en: string;
    hi: string;
    mr: string;
  };
  slug: string;
  category: 'Qualification' | 'Exam / Board' | 'State' | 'Category' | 'General';
}

export const CANONICAL_WORD_BANK: CanonicalTag[] = [
  // Qualifications
  { name: { en: '10th Pass', hi: '10वीं पास', mr: '१० वी उत्तीर्ण' }, slug: '10th-pass', category: 'Qualification' },
  { name: { en: '12th Pass', hi: '12वीं पास', mr: '१२ वी उत्तीर्ण' }, slug: '12th-pass', category: 'Qualification' },
  { name: { en: 'Graduate', hi: 'स्नातक', mr: 'पदवीधर' }, slug: 'graduate', category: 'Qualification' },
  { name: { en: 'Post Graduate', hi: 'परास्नातक', mr: 'पदव्युत्तर' }, slug: 'post-graduate', category: 'Qualification' },
  { name: { en: 'Diploma', hi: 'डिप्लोमा', mr: 'पदविका' }, slug: 'diploma', category: 'Qualification' },
  { name: { en: 'ITI Pass', hi: 'आईटीआई पास', mr: 'आयटीआय उत्तीर्ण' }, slug: 'iti-pass', category: 'Qualification' },
  { name: { en: 'Engineering', hi: 'इंजीनियरिंग', mr: 'अभियांत्रिकी' }, slug: 'engineering', category: 'Qualification' },
  { name: { en: 'Teacher', hi: 'शिक्षक', mr: 'शिक्षक' }, slug: 'teacher', category: 'Qualification' },
  { name: { en: 'Medical', hi: 'चिकित्सा / मेडिकल', mr: 'वैद्यकीय' }, slug: 'medical', category: 'Qualification' },

  // Sectors & Organizations
  { name: { en: 'SSC', hi: 'एसएससी', mr: 'एसएससी' }, slug: 'ssc', category: 'Exam / Board' },
  { name: { en: 'UPSC', hi: 'यूपीएससी', mr: 'यूपीएससी' }, slug: 'upsc', category: 'Exam / Board' },
  { name: { en: 'Railway', hi: 'रेलवे', mr: 'रेल्वे' }, slug: 'railway', category: 'Exam / Board' },
  { name: { en: 'Bank', hi: 'बैंक', mr: 'बँक' }, slug: 'bank', category: 'Exam / Board' },
  { name: { en: 'Police', hi: 'पुलिस', mr: 'पोलीस' }, slug: 'police', category: 'Exam / Board' },
  { name: { en: 'Defense', hi: 'रक्षा / सेना', mr: 'संरक्षण दल' }, slug: 'defense', category: 'Exam / Board' },
  { name: { en: 'MPSC', hi: 'एमपीएससी', mr: 'एमपीएससी' }, slug: 'mpsc', category: 'Exam / Board' },
  { name: { en: 'BPSC', hi: 'बीपीएससी', mr: 'बीपीएससी' }, slug: 'bpsc', category: 'Exam / Board' },
  { name: { en: 'NTA', hi: 'एनटीए', mr: 'एनटीए' }, slug: 'nta', category: 'Exam / Board' },
  { name: { en: 'ISRO', hi: 'इसरो', mr: 'इस्रो' }, slug: 'isro', category: 'Exam / Board' },
  { name: { en: 'DRDO', hi: 'डीआरडीओ', mr: 'डीआरडीओ' }, slug: 'drdo', category: 'Exam / Board' },

  // Primary Categories
  { name: { en: 'Latest Jobs', hi: 'नवीनतम नौकरियां', mr: 'नवीनतम नोकऱ्या' }, slug: 'latest-jobs', category: 'Category' },
  { name: { en: 'Admit Card', hi: 'प्रवेश पत्र', mr: 'प्रवेश पत्र' }, slug: 'admit-card', category: 'Category' },
  { name: { en: 'Results', hi: 'परीक्षा परिणाम', mr: 'निकाल' }, slug: 'results', category: 'Category' },
  { name: { en: 'Answer Key', hi: 'उत्तर कुंजी', mr: 'उत्तर तालिका' }, slug: 'answer-key', category: 'Category' },
  { name: { en: 'Syllabus', hi: 'पाठ्यक्रम', mr: 'अभ्यासक्रम' }, slug: 'syllabus', category: 'Category' },
  { name: { en: 'Admission', hi: 'प्रवेश', mr: 'प्रवेश प्रक्रिया' }, slug: 'admission', category: 'Category' },

  // Locations / States
  { name: { en: 'Maharashtra', hi: 'महाराष्ट्र', mr: 'महाराष्ट्र' }, slug: 'maharashtra', category: 'State' },
  { name: { en: 'Delhi', hi: 'दिल्ली', mr: 'दिल्ली' }, slug: 'delhi', category: 'State' },
  { name: { en: 'UP', hi: 'उत्तर प्रदेश', mr: 'उत्तर प्रदेश' }, slug: 'up', category: 'State' },
  { name: { en: 'Bihar', hi: 'बिहार', mr: 'बिहार' }, slug: 'bihar', category: 'State' },
  { name: { en: 'Rajasthan', hi: 'राजस्थान', mr: 'राजस्थान' }, slug: 'rajasthan', category: 'State' },
  { name: { en: 'All India', hi: 'अखिल भारतीय', mr: 'संपूर्ण भारत' }, slug: 'all-india', category: 'State' }
];

export const MATRIX_TAGS_MAP: Record<string, string> = CANONICAL_WORD_BANK.reduce((acc, item) => {
  acc[item.name.en] = item.slug;
  return acc;
}, {} as Record<string, string>);
