import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { documentUrl } = await req.json();

    if (!documentUrl) {
      return NextResponse.json({ error: "Document URL is required" }, { status: 400 });
    }

    // SIMULATE AI EXTRACTION DELAY
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Dynamic mock logic based on URL keywords
    const urlLower = documentUrl.toLowerCase();
    
    let extractedData;
    
    if (urlLower.includes('railway') || urlLower.includes('rrb')) {
      extractedData = {
        title: "RRB NTPC Recruitment 2026",
        organization: "Railway Recruitment Board",
        last_date: "2026-08-20",
        status: "New",
        statusColor: "text-blue-800 bg-blue-100 border border-blue-200",
        total_vacancies: "35,281",
        vacancies: [
          { name: "Station Master", education: "Degree in any discipline", vac: "6,865" },
          { name: "Goods Guard", education: "Degree in any discipline", vac: "5,748" },
          { name: "Commercial Apprentice", education: "Degree in any discipline", vac: "259" },
          { name: "Ticket Clerk", education: "12th Pass with 50% Marks", vac: "4,940" }
        ],
        description_html: `<h2>Important Dates</h2><ul><li>Notification Released: 10/07/2026</li><li>Last Date to Apply: 20/08/2026</li><li>CBT 1 Exam Date: Nov 2026</li></ul><h2>Application Fee</h2><ul><li>General/OBC: ₹500/- (₹400 refundable)</li><li>SC/ST/Women/EBC: ₹250/- (Fully refundable)</li></ul><h2>Age Limit</h2><ul><li>Minimum Age: 18 Years</li><li>Maximum Age: 33 Years</li></ul>`,
        seo_title: "RRB NTPC Recruitment 2026 - Apply for 35,281 Vacancies",
        seo_description: "Railway Recruitment Board (RRB) has announced 35,281 vacancies for NTPC. Check eligibility, exam dates, and apply online."
      };
    } else if (urlLower.includes('ssc')) {
      extractedData = {
        title: "SSC CGL Examination 2026",
        organization: "Staff Selection Commission",
        last_date: "2026-06-24",
        status: "Trending",
        statusColor: "text-green-800 bg-green-100 border border-green-200",
        total_vacancies: "12,256",
        vacancies: [
          { name: "Assistant Section Officer", education: "Bachelor's Degree", vac: "2,150" },
          { name: "Income Tax Inspector", education: "Bachelor's Degree", vac: "1,550" },
          { name: "Tax Assistant", education: "Bachelor's Degree", vac: "4,000" }
        ],
        description_html: `<h2>Important Dates</h2><ul><li>Notification Released: 01/05/2026</li><li>Last Date to Apply: 24/06/2026</li><li>Tier-I Exam Date: Aug-Sep 2026</li></ul><h2>Application Fee</h2><ul><li>General/OBC: ₹100/-</li><li>SC/ST/Women: Exempted</li></ul><h2>Age Limit</h2><ul><li>Minimum Age: 18 Years</li><li>Maximum Age: 32 Years</li></ul>`,
        seo_title: "SSC CGL 2026 Recruitment - Apply Online for 12,256 Posts",
        seo_description: "SSC CGL 2026 notification out for 12,256 vacancies. Apply online before 24 June."
      };
    } else {
      extractedData = {
        title: "UPSC Civil Services Examination 2026",
        organization: "Union Public Service Commission",
        last_date: "2026-07-15",
        status: "New",
        statusColor: "text-blue-800 bg-blue-100 border border-blue-200",
        total_vacancies: "1,105",
        vacancies: [
          { name: "Indian Administrative Service (IAS)", education: "Any Bachelor's Degree", vac: "180" },
          { name: "Indian Police Service (IPS)", education: "Any Bachelor's Degree", vac: "200" },
          { name: "Indian Foreign Service (IFS)", education: "Any Bachelor's Degree", vac: "35" }
        ],
        description_html: `<h2>Important Dates</h2><ul><li>Notification Released: 05/06/2026</li><li>Last Date to Apply: 15/07/2026</li><li>Prelims Exam Date: 26/09/2026</li></ul><h2>Application Fee</h2><ul><li>General/OBC/EWS: ₹100/-</li><li>SC/ST/PH/Women: Exempted</li></ul><h2>Age Limit</h2><ul><li>Minimum Age: 21 Years</li><li>Maximum Age: 32 Years</li><li>Age Relaxation Extra as per Rules</li></ul>`,
        seo_title: "UPSC Civil Services (IAS/IPS) Online Form 2026",
        seo_description: "UPSC has released the Civil Services Examination (CSE) 2026 notification for 1,105 posts. Apply online before 15 July 2026."
      };
    }

    return NextResponse.json({ data: extractedData });

  } catch (error) {
    return NextResponse.json({ error: "Failed to parse document" }, { status: 500 });
  }
}
