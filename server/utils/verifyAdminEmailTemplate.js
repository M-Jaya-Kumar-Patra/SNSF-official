const verificationAdminEmail = (name, otp) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
      <h2 style="color: #333;">Hello ${name},</h2>
      <p style="font-size: 16px; color: #555;">
        Welcome to the Admin Panel! To verify your email address, please use the OTP below:
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; letter-spacing: 5px; color: #1a73e8; font-weight: bold;">${otp}</span>
      </div>

      <p style="font-size: 14px; color: #777;">
        This OTP is valid for 10 minutes. If you did not request this, please ignore this email.
      </p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

      <p style="font-size: 13px; color: #999; text-align: center;">
        &copy; ${new Date().getFullYear()} Your Company. All rights reserved.
      </p>
    </div>
  `;
};

export default verificationAdminEmail;
