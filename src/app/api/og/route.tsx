import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Dynamic params
    const title = searchParams.get('title');
    const org = searchParams.get('org') || 'Government Job';
    const type = searchParams.get('type') || 'job'; // 'job', 'category', 'general'
    
    // Check if it's a general/category card or specific job card
    if (type === 'general' || !title) {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#002D62',
              backgroundImage: 'linear-gradient(to bottom right, #002D62, #0A58CA)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                padding: '20px 60px',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              }}
            >
              <h1 style={{ fontSize: 80, fontWeight: 900, color: '#0A58CA', margin: 0 }}>
                GovJobWala
              </h1>
            </div>
            <p style={{ fontSize: 40, color: 'white', marginTop: 40, fontWeight: 600 }}>
              India's Trusted Government Job Portal
            </p>
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }

    // specific job card
    const vacancies = searchParams.get('vacancies');
    const lastDate = searchParams.get('lastDate');
    const logoUrl = searchParams.get('logoUrl');
    
    let absoluteLogoUrl = logoUrl;
    if (absoluteLogoUrl && absoluteLogoUrl.startsWith('/')) {
      absoluteLogoUrl = new URL(absoluteLogoUrl, 'https://govjobwala.com').toString();
    }
    
    let logoDataUrl = absoluteLogoUrl;
    if (absoluteLogoUrl) {
      try {
        const response = await fetch(absoluteLogoUrl, { cache: 'force-cache' });
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const contentType = response.headers.get('content-type') || 'image/png';
          const base64Str = Buffer.from(arrayBuffer).toString('base64');
          logoDataUrl = `data:${contentType};base64,${base64Str}`;
        }
      } catch (err) {
        console.error("OG Image Fetch Error:", err);
      }
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            padding: '60px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Top header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {logoDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoDataUrl} alt="logo" width="80" height="80" style={{ borderRadius: '12px', objectFit: 'contain' }} />
              ) : (
                <div style={{ width: 80, height: 80, backgroundColor: '#EFF6FF', color: '#1D4ED8', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 'bold' }}>
                  {org.charAt(0)}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: 32, color: '#64748B', fontWeight: 600 }}>{org}</span>
                <span style={{ fontSize: 24, color: '#3B82F6', fontWeight: 700 }}>RECRUITMENT 2026</span>
              </div>
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#0A58CA' }}>
              GovJobWala
            </div>
          </div>

          {/* Title Area */}
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '40px' }}>
            <h1 style={{ fontSize: 72, fontWeight: 900, color: '#0F172A', lineHeight: 1.1, margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
              {title}
            </h1>
          </div>

          {/* Badges/Info */}
          <div style={{ display: 'flex', gap: '30px', marginTop: '40px' }}>
            {vacancies && vacancies !== '-' && (
              <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#EFF6FF', padding: '20px 40px', borderRadius: '16px', borderLeft: '8px solid #3B82F6' }}>
                <span style={{ fontSize: 24, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Vacancies</span>
                <span style={{ fontSize: 48, color: '#1E40AF', fontWeight: 900 }}>{vacancies}</span>
              </div>
            )}
            {lastDate && lastDate !== '-' && (
              <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#FEF2F2', padding: '20px 40px', borderRadius: '16px', borderLeft: '8px solid #EF4444' }}>
                <span style={{ fontSize: 24, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Last Date</span>
                <span style={{ fontSize: 48, color: '#991B1B', fontWeight: 900 }}>{lastDate}</span>
              </div>
            )}
          </div>
          
          {/* Footer Bar */}
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #E2E8F0', paddingTop: '30px' }}>
             <div style={{ fontSize: 28, color: '#64748B', fontWeight: 500 }}>
               View full details and apply online at <b style={{ color: '#0A58CA' }}>govjobwala.com</b>
             </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(e.message);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
