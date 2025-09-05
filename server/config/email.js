const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,      // your Gmail address
    pass: process.env.EMAIL_PASSWORD   // your app password
  },
  tls: {
    rejectUnauthorized: false
  }
});


// Email template for password reset
const createPasswordResetEmail = (email, otp) => {
  return {
    from: '"StudyTracker Support" <noreply@studytracker.com>',
    to: email,
    subject: 'Your StudyTracker Password Reset Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px;">StudyTracker</h1>
            <p style="color: #6b7280; margin: 5px 0 0 0;">Password Reset Request</p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
              Hello,
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 10px 0;">
              We received a request to reset your password for your StudyTracker account. If you made this request, please use the verification code below:
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
            <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 24px;">Your Verification Code</h2>
            <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px; margin: 15px 0;">
              ${otp}
            </div>
            <p style="color: #dc2626; font-size: 14px; margin: 10px 0 0 0; font-weight: 500;">
              ⏰ This code expires in 10 minutes
            </p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
              If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
            </p>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Best regards,<br>
              <strong>The StudyTracker Team</strong>
            </p>
          </div>
        </div>
      </div>
    `
  };
};

// Function to send password reset email
const sendPasswordResetEmail = async (email, otp) => {
  try {
    /*console.log('Attempting to send email to:', email);
    console.log('Using email config:', {
      user: process.env.EMAIL_USER,
      hasPassword: !!process.env.EMAIL_PASSWORD
    });*/
    
    const mailOptions = createPasswordResetEmail(email, otp);
    /*console.log('Mail options created:', {
      to: mailOptions.to,
      subject: mailOptions.subject,
      hasHtml: !!mailOptions.html
    });*/
    
    const info = await transporter.sendMail(mailOptions);
    // console.log('Password reset email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    // console.error('Error details:', {
    //   code: error.code,
    //   command: error.command,
    //   response: error.response
    // });
    return false;
  }
};

// Email template for signup verification
const createSignupVerificationEmail = (email, otp) => {
  return {
    from: '"StudyTracker Support" <noreply@studytracker.com>',
    to: email,
    subject: 'Verify Your StudyTracker Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px;">StudyTracker</h1>
            <p style="color: #6b7280; margin: 5px 0 0 0;">Account Verification</p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
              Hello,
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 10px 0;">
              Thank you for signing up for StudyTracker! To complete your registration, please use the verification code below:
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
            <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 24px;">Your Verification Code</h2>
            <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px; margin: 15px 0;">
              ${otp}
            </div>
            <p style="color: #dc2626; font-size: 14px; margin: 10px 0 0 0; font-weight: 500;">
              ⏰ This code expires in 10 minutes
            </p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0;">
              If you didn't create a StudyTracker account, please ignore this email.
            </p>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              Best regards,<br>
              <strong>The StudyTracker Team</strong>
            </p>
          </div>
        </div>
      </div>
    `
  };
};

// Function to send signup verification email
const sendSignupVerificationEmail = async (email, otp) => {
  try {
    const mailOptions = createSignupVerificationEmail(email, otp);
    const info = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending signup verification email:', error);
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendSignupVerificationEmail
}; 