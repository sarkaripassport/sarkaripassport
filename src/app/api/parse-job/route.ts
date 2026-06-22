import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { documentUrl } = await req.json();

    if (!documentUrl) {
      return NextResponse.json({ error: "Document URL is required" }, { status: 400 });
    }

    // SIMULATE AI EXTRACTION DELAY
    await new Promise(resolve => setTimeout(resolve, 2500));

    // SIMULATE EXTRACTED JSON FROM AI
    const extractedData = {
      title: "UPSC Civil Services Examination 2026",
      organization: "Union Public Service Commission",
      last_date: "15 Jul 2026",
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

    return NextResponse.json({ data: extractedData });

  } catch (error) {
    return NextResponse.json({ error: "Failed to parse document" }, { status: 500 });
  }
}
