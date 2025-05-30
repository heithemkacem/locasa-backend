export const htmlContentCreateAccount = (otp: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #ED7354; padding: 20px; text-align: center;">
      <img src="https://ik.imagekit.io/gqfmeowjp/splash-icon.png?updatedAt=1748534501191" alt="Locasa Logo" style="width: 60px; height: 60px; border-radius: 50%; background: #fff;" />
      <h2 style="color: #fff; margin-top: 10px;">Account Verification</h2>
    </div>
    <div style="padding: 30px; color: #333;">
      <p>Dear User,</p>
      <p>Thank you for registering with us. To complete your registration, please use the following One-Time Password (OTP):</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 28px; font-weight: bold; color: #ED7354;">${otp}</span>
      </div>
      <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
      <p>If you did not initiate this request, please ignore this email.</p>
      <p>Best regards,<br/>The Locasa Team</p>
    </div>
    <div style="background-color: #f7f7f7; text-align: center; padding: 15px; font-size: 12px; color: #999;">
      &copy; ${new Date().getFullYear()} Locasa. All rights reserved.
    </div>
  </div>
`;

export const htmlContentResetPassword = (otp: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #ED7354; padding: 20px; text-align: center;">
      <img src="https://ik.imagekit.io/gqfmeowjp/splash-icon.png?updatedAt=1748534501191" alt="Locasa Logo" style="width: 60px; height: 60px; border-radius: 50%; background: #fff;" />
      <h2 style="color: #fff; margin-top: 10px;">Reset Password Request</h2>
    </div>
    <div style="padding: 30px; color: #333;">
      <p>Dear User,</p>
      <p>You requested a password reset. Please use the following One-Time Password (OTP) to reset your password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 28px; font-weight: bold; color: #ED7354;">${otp}</span>
      </div>
      <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Best regards,<br/>The Locasa Team</p>
    </div>
    <div style="background-color: #f7f7f7; text-align: center; padding: 15px; font-size: 12px; color: #999;">
      &copy; ${new Date().getFullYear()} Locasa. All rights reserved.
    </div>
  </div>
`;

export const htmlContentResendOTP = (
  otp: string,
  type: "created-account" | "reset-password"
) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
    <div style="background-color: #ED7354; padding: 20px; text-align: center;">
      <img src="https://ik.imagekit.io/gqfmeowjp/splash-icon.png?updatedAt=1748534501191" alt="Locasa Logo" style="width: 60px; height: 60px; border-radius: 50%; background: #fff;" />
      <h2 style="color: #fff; margin-top: 10px;">${
        type === "created-account" ? "Account Verification" : "Password Reset"
      } OTP</h2>
    </div>
    <div style="padding: 30px; color: #333;">
      <p>Dear User,</p>
      <p>Here is your One-Time Password (OTP):</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 28px; font-weight: bold; color: #ED7354;">${otp}</span>
      </div>
      <p>This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
      <p>Best regards,<br/>The Locasa Team</p>
    </div>
    <div style="background-color: #f7f7f7; text-align: center; padding: 15px; font-size: 12px; color: #999;">
      &copy; ${new Date().getFullYear()} Locasa. All rights reserved.
    </div>
  </div>
`;
