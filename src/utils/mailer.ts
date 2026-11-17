
interface SendRecoveryEmailOptions {
    toEmail: string;
    studentName: string;
    recoveryCode: string;
    identifier: string;
}

const escapeHtml = (value: string): string => {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

export const sendRecoveryCodeEmail = async ({
    toEmail,
    studentName,
    recoveryCode,
    identifier
}: SendRecoveryEmailOptions): Promise<{
    success: boolean;
    isDevFallback: boolean;
}> => {

    const brevoApiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME || "IJSE UniFlow";

    if (!brevoApiKey || !senderEmail) {
        throw new Error(
            "Brevo configuration missing. Check BREVO_API_KEY and BREVO_SENDER_EMAIL."
        );
    }

    const safeName = escapeHtml(studentName || "Student");
    const safeIdentifier = escapeHtml(identifier);
    const safeCode = escapeHtml(recoveryCode);

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f7f7f7;
                margin: 0;
                padding: 20px;
                color: #171717;
            }
            .container {
                max-width: 540px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                border: 1px solid #e5e5e5;
            }
            .header {
                background: #171717;
                padding: 28px;
                text-align: center;
            }
            .logo {
                font-size: 32px;
                font-weight: 900;
                color: #ffffff;
            }
            .logo-dot {
                color: #D71920;
            }
            .content {
                padding: 32px;
            }
            .greeting {
                font-size: 18px;
                font-weight: 700;
                margin-bottom: 12px;
            }
            .text {
                font-size: 14px;
                line-height: 1.6;
                color: #525252;
                margin-bottom: 24px;
            }
            .code-box {
                background: #fff1f2;
                border: 2px dashed #D71920;
                border-radius: 10px;
                padding: 18px;
                text-align: center;
                margin-bottom: 24px;
            }
            .code-label {
                font-size: 12px;
                font-weight: 600;
                color: #9f1239;
                margin-bottom: 6px;
            }
            .code-value {
                font-size: 36px;
                font-weight: 800;
                letter-spacing: 8px;
                color: #D71920;
                margin: 0;
            }
            .meta-box {
                background: #f9fafb;
                border-radius: 8px;
                padding: 12px 16px;
                font-size: 12px;
                color: #6b7280;
                margin-bottom: 24px;
            }
            .footer {
                background: #fafafa;
                border-top: 1px solid #e5e5e5;
                padding: 18px;
                text-align: center;
                font-size: 11px;
                color: #a3a3a3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">IJSE<span class="logo-dot">.</span></div>
                <div style="color:#a3a3a3;font-size:12px;margin-top:6px;">
                    Institute of Java & Software Engineering
                </div>
            </div>

            <div class="content">
                <div class="greeting">Hello ${safeName},</div>

                <div class="text">
                    We received a request to reset your password
                    for your IJSE UniFlow student account.
                    Use the recovery code below to verify your account.
                </div>

                <div class="code-box">
                    <div class="code-label">YOUR PASSWORD RECOVERY CODE</div>
                    <div class="code-value">${safeCode}</div>
                </div>

                <div class="meta-box">
                    <strong>Login Identifier:</strong> ${safeIdentifier}<br>
                    <strong>Code Expiration:</strong> 15 minutes<br><br>
                    If you did not request this password reset,
                    please ignore this email.
                </div>

                <div class="text">
                    For security reasons, never share this recovery code.
                </div>
            </div>

            <div class="footer">
                © 2026 IJSE UniFlow • Sri Lanka's No. 1 Software Engineering Institute
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        const response = await fetch(
            "https://api.brevo.com/v3/smtp/email",
            {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "api-key": brevoApiKey,
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    sender: {
                        name: senderName,
                        email: senderEmail
                    },
                    to: [
                        {
                            email: toEmail
                        }
                    ],
                    subject: "IJSE UniFlow - Password Recovery Code",
                    textContent:
                        `Hello ${studentName || "Student"}, ` +
                        `your IJSE UniFlow recovery code is ${recoveryCode}. ` +
                        `It expires in 15 minutes.`,
                    htmlContent
                })
            }
        );

        if (!response.ok) {
            const errorDetails = await response.text();

            console.error("[BREVO EMAIL ERROR]", response.status, errorDetails);

            throw new Error(
                `Brevo rejected the email request (${response.status}).`
            );
        }

        console.log(`[BREVO EMAIL SENT] Email accepted for ${toEmail}`);

        return {
            success: true,
            isDevFallback: false
        };

    } catch (error) {
        console.error("[BREVO EMAIL ERROR]", error);

        throw new Error(
            "Unable to send recovery email. Please try again later."
        );
    }
};
