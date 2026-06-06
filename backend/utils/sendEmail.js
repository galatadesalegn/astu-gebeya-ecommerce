import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html, templateParams = {} }) => {
    // If EmailJS env variables are provided, use EmailJS REST API (server-side)
    // Requires: EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY (user id)
    if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID && process.env.EMAILJS_PUBLIC_KEY) {
        try {
            const payload = {
                service_id: process.env.EMAILJS_SERVICE_ID,
                template_id: process.env.EMAILJS_TEMPLATE_ID,
                user_id: process.env.EMAILJS_PUBLIC_KEY,
                template_params: {
                    to_email: to,
                    subject,
                    html,
                    ...templateParams,
                },
            };

            const headers = { 'Content-Type': 'application/json' };
            // If a private key is provided, send it as a Bearer token for server-side auth
            if (process.env.EMAILJS_PRIVATE_KEY) {
                headers['Authorization'] = `Bearer ${process.env.EMAILJS_PRIVATE_KEY}`;
            } else if (process.env.EMAILJS_PUBLIC_KEY) {
                // legacy: include user_id in payload when public key is provided
                payload.user_id = process.env.EMAILJS_PUBLIC_KEY;
            }

            const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const body = await res.text();
                throw new Error(`EmailJS error: ${res.status} ${body}`);
            }

            return { provider: 'emailjs', status: 'sent' };
        } catch (err) {
            console.error('EmailJS send failed:', err.message || err);
            // fall through to SMTP fallback
        }
    }

    // Fallback to nodemailer SMTP (existing behavior)
    let transporter;

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else if (process.env.NODE_ENV !== 'production') {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    } else {
        throw new Error('SMTP credentials are required in production or provide EmailJS env variables');
    }

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"ASTU Gebeya" <noreply@astugebeya.com>',
        to,
        subject,
        html,
    };

    const info = await transporter.sendMail(mailOptions);

    if (process.env.NODE_ENV !== 'production') {
        console.log(`📧 Email Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return { provider: 'smtp', info };
};

export default sendEmail;
