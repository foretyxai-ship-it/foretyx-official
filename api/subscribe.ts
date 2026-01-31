import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Vercel handles env variables automatically in production
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const resend = new Resend(RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { email } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Valid email required' });

  try {
    // 1. Save to Supabase
    const { error: dbError } = await supabase.from('waitlist').insert([{ email }]);
    if (dbError) throw dbError;

    // 2. Send via Resend (Using your verified domain)
    await resend.emails.send({
      from: 'Soham from Foretyx <hello@foretyx.in>', 
      to: email,
      subject: 'Waitlist Confirmed | Foretyx',
      html: `
        <div style="font-family: sans-serif; background: #000; color: #fff; padding: 40px; border-radius: 12px; border: 1px solid #333;">
          <h2 style="color: #10b981;">You're on the list.</h2>
          <p>Thank you for joining the Foretyx waitlist. We'll notify you soon.</p>
          <hr style="border-top: 1px solid #333; margin: 20px 0;" />
          <p style="font-size: 10px; color: #666;">© 2026 Foretyx, Inc.</p>
        </div>
      `
    });

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Backend Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}