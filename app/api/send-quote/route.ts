import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);
const MY_EMAIL = 'nasrullahtanim@gmail.com';
const FROM_EMAIL = 'onboarding@resend.dev';

export async function POST(req: NextRequest) {
  try {
    const { pdfBase64, customerName, services, total, discount } = await req.json();

    const serviceList = services
      .map((s: any) => `• ${s.title} — $${s.price}/mo`)
      .join('\n');

    const emailText = `
New quote from SlideIn Venture

Customer: ${customerName || 'Unknown'}

Selected services (${services.length}):
${serviceList}

${discount > 0 ? `Bundle discount: ${Math.round(discount * 100)}% off` : ''}
Total: $${total.toLocaleString()}/mo

(Quote PDF attached)
    `.trim();

    const pdfBuffer = Buffer.from(pdfBase64, 'base64');

    // Send email to me (nasrullahtanim@gmail.com) with the PDF attached
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: MY_EMAIL,
      subject: `New Quote — ${customerName || 'Unknown'} (${services.length} services)`,
      text: emailText,
      attachments: [
        {
          filename: `SlideIn-Venture-Quote-${Date.now()}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Send quote error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
