import nodemailer from "nodemailer";

interface SendRecoveryEmailOptions {
    toEmail: string;
    studentName: string;
    recoveryCode: string;
    identifier: string;
}

export const sendRecoveryCodeEmail = async ({
    toEmail,
    studentName,
    recoveryCode,
    identifier
}: SendRecoveryEmailOptions): Promise<{ success: boolean; isDevFallback: boolean }> => {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromAddress = process.env.SMTP_FROM || '"IJSE UniFlow Portal" <no-reply@uniflow.lk>';

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 20px; color: #171717; }
            .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e5e5; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
            .header { background: #171717; padding: 28px; text-align: center; }
            .logo { font-size: 32px; font-weight: 900; color: #ffffff; margin: 0; letter-spacing: 1px; }
            .logo-dot { color: #D71920; }
            .content { padding: 32px; }
            .greeting { font-size: 18px; font-weight: 700; margin-bottom: 12px; }
            .text { font-size: 14px; line-height: 1.6; color: #525252; margin-bottom: 24px; }
            .code-box { background: #fff1f2; border: 2px dashed #D71920; border-radius: 10px; padding: 18px; text-align: center; margin-bottom: 24px; }
            .code-label { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #9f1239; letter-spacing: 1px; margin-bottom: 6px; }
            .code-value { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #D71920; margin: 0; font-family: monospace; }
            .meta-box { background: #f9fafb; border-radius: 8px; padding: 12px 16px; font-size: 12px; color: #6b7280; margin-bottom: 24px; border: 1px solid #f3f4f6; }
            .footer { background: #fafafa; border-top: 1px solid #e5e5e5; padding: 18px; text-align: center; font-size: 11px; color: #a3a3a3; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">IJSE<span class="logo-dot">.</span></div>
                <div style="color: #a3a3a3; font-size: 12px; margin-top: 6px;">Institute of Java & Software Engineering</div>
            </div>
            <div class="content">
                <div class="greeting">Hello ${studentName || "Student"},</div>
                <div class="text">
                    We received a request to reset your password for your IJSE UniFlow student account.
                    Use the 6-digit recovery code below to verify your account and set a new password.
                </div>
                
                <div class="code-box">
                    <div class="code-label">Your Password Recovery Code</div>
                    <div class="code-value">${recoveryCode}</div>
                </div>

                <div class="meta-box">
                    • <strong>Login Identifier:</strong> ${identifier}<br>
                    • <strong>Code Expiration:</strong> 15 minutes<br>
                    • If you did not request this password reset, please ignore this email or contact administration immediately.
                </div>

                <div class="text" style="font-size: 12px; color: #737373;">
                    For security reasons, never share this recovery code with anyone.
                </div>
            </div>
            <div class="footer">
                © 2026 IJSE UniFlow • Sri Lanka's No. 1 Software Engineering Institute
            </div>
        </div>
    </body>
    </html>
    `;

    // Check if SMTP or Gmail service is configured
    const isGmail = process.env.SMTP_SERVICE === "gmail" || 
                    (smtpHost && smtpHost.toLowerCase().includes("gmail")) || 
                    (smtpUser && smtpUser.toLowerCase().includes("@gmail.com"));

    if (smtpUser && smtpPass) {
        try {
            const transportOptions: any = isGmail
                ? {
                    service: "gmail",
                    auth: {
                        user: smtpUser,
                        pass: smtpPass
                    }
                }
                : {
                    host: smtpHost || "smtp.gmail.com",
                    port: smtpPort,
                    secure: process.env.SMTP_SECURE === "true" || smtpPort === 465,
                    auth: {
                        user: smtpUser,
                        pass: smtpPass
                    }
                };

            const transporter = nodemailer.createTransport(transportOptions);

            await transporter.sendMail({
                from: fromAddress,
                to: toEmail,
                subject: `IJSE UniFlow - Password Recovery Code: ${recoveryCode}`,
                text: `Your IJSE UniFlow password recovery code is: ${recoveryCode}. It expires in 15 minutes.`,
                html: htmlContent
            });

            console.log(`[EMAIL DISPATCHED] Successfully sent real recovery email to ${toEmail}`);
            return { success: true, isDevFallback: false };
        } catch (error: any) {
            console.error(`[EMAIL ERROR] Failed to send email via SMTP to ${toEmail}:`, error.message || error);
            if (isGmail && error.message?.includes("Invalid login")) {
                console.warn("[GMAIL NOTICE] For Gmail accounts, please use a Google App Password (16 characters) generated under Account Security -> 2-Step Verification -> App passwords.");
            }
            // Fall through to dev console log
        }
    }

    // Fallback in development/local test mode when SMTP credentials are not configured or failed
    console.log("\n=======================================================");
    console.log("   [IJSE EMAIL SERVICE - REAL EMAIL RECOVERY CODE]");
    console.log(`   Destination Real Email: ${toEmail}`);
    console.log(`   Account Identifier:     ${identifier}`);
    console.log(`   Student Name:           ${studentName || "Student"}`);
    console.log(`   Recovery Code:          ${recoveryCode}`);
    console.log("   Code Validity:          15 minutes");
    console.log("=======================================================\n");

    return { success: true, isDevFallback: true };
};
