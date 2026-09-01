export const verifyEmailTemplates = ({ otp, title = "confirm-email" }) => {
  return `
  
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f6f8; padding: 40px 10px;">
        <tr>
            <td align="center">
                
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 460px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: #4f46e5; padding: 28px 20px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600;">${title}</h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding: 32px 24px; text-align: center;">
                            <p style="color: #374151; font-size: 15px; margin: 0 0 8px 0; font-weight: 600;">Hello,</p>
                    
                            
                            <!-- OTP Display Box -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <div style="background-color: #f3f4f6; border: 2px dashed #6366f1; border-radius: 8px; padding: 14px 20px; display: inline-block;">
                                            <span style="font-size: 32px; font-weight: 800; color: #4f46e5; letter-spacing: 6px; font-family: monospace;">${otp}</span>
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <p style="color: #9ca3af; font-size: 12px; line-height: 1.4; margin: 24px 0 0 0;">If you didn't request this code, you can safely ignore this email.</p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>`;
};
