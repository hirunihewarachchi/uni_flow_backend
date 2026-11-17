
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
}: SendRecoveryEmailOptions): Promise<{
    success: boolean;
    isDevFallback: boolean;
}> => {

    const brevoApiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName =
        process.env.BREVO_SENDER_NAME || "IJSE UniFlow";

    // IJSE UniFlow Recovery Email Template
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                Roboto, Helvetica, Arial, sans-serif;
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
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
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
                margin: 0;
                letter-spacing: 1px;
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
                text-transform: uppercase;
                color: #9f1239;
                letter-spacing: 1px;
                margin-bottom: 6px;
            }

            .code-value {
                font-size: 36px;
                font-weight: 800;
                letter-spacing: 8px;
                color: #D71920;
                margin: 0;
                font-family: monospace;
            }

            .meta-box {
                background: #f9fafb;
                border-radius: 8px;
                padding: 12px 16px;
                font-size: 12px;
                color: #6b7280;
                margin-bottom: 24px;
                border: 1px solid #f3f4f6;
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
                <div class="logo">
                    IJSE<span class="logo-dot">.</span>
                </div>

                <div style="color: #a3a3a3; font-size: 12px; margin-top: 6px;">
                    Institute of Java & Software Engineering
                </div>
            </div>

            <div class="content">

                <div class="greeting">
                    Hello ${escapeHtml(studentName || "Student")},
                </div>

                <div class="text">
                    We received a request to reset your password
                    for your IJSE UniFlow student account.

                    Use the 6-digit recovery code below to verify
                    your account and set a new password.
                </div>

                <div class="code-box">

                    <div class="code-label">
                        Your Password Recovery Code
                    </div>

                    <div class="code-value">
                        ${escapeHtml(recoveryCode)}
                    </div>

                </div>

                <div class="meta-box">
                    • <strong>Login Identifier:</strong>
                    ${escapeHtml(identifier)}
                    <br>

                    • <strong>Code Expiration:</strong>
                    15 minutes
                    <br>

                    • If you did not request this password reset,
                    please ignore this email or contact administration.
                </div>

                <div class="text" style="font-size: 12px; color: #737373;">
                    For security reasons, never share this recovery
                    code with anyone.
                </div>

            </div>

            <div class="footer">
                © 2026 IJSE UniFlow • Sri Lanka's No. 1 Software
                Engineering Institute
            </div>

        </div>
    </body>
    </html>
    `;

    // Send email using Brevo API
    if (!brevoApiKey || !senderEmail) {
        throw new Error(
            "Brevo configuration missing. Check BREVO_API_KEY and BREVO_SENDER_EMAIL."
        );
    }

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
                        `Your IJSE UniFlow password recovery code is ${recoveryCode}. It expires in 15 minutes.`,

                    htmlContent: htmlContent

                })
            }
        );

        if (!response.ok) {

            const errorDetails = await response.text();

            throw new Error(
                `Brevo API Error (${response.status}): ${errorDetails}`
            );
        }

        const result = await response.json();

        console.log(
            `[EMAIL DISPATCHED] Recovery email sent to ${toEmail}`
        );

        return {
            success: true,
            isDevFallback: false
        };

    } catch (error: any) {

        console.error(
            "[BREVO EMAIL ERROR]:",
            error.message || error
        );

        throw new Error(
            "Unable to send password recovery email. Please try again later."
        );
    }
};


// Escape dynamic values before inserting them into HTML
const escapeHtml = (value: string): string => {
    return String(value).replace(/[&<>"']/g, (char) => {
        const entities: Record<string, string> = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[char];
    });
};
