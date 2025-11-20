import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a transporter object with environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Use App Password for Gmail
  }
});

// Verify the transporter configuration
const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log('✅ Email transporter is ready to send emails');
    return true;
  } catch (error) {
    console.error('❌ Error verifying email transporter:', error);
    return false;
  }
};

// Function to send email
const sendEmail = async (mailOptions) => {
  try {
    // Verify transporter before sending
    const isVerified = await verifyTransporter();
    if (!isVerified) {
      throw new Error('Email transporter verification failed');
    }

    // Send the email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      ...mailOptions
    });

    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Function to send welcome email
const sendWelcomeEmail = async (to, userName) => {
  const mailOptions = {
    to,
    subject: 'Welcome to SynapNote!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to SynapNote, ${userName}! 🎉</h2>
        <p>Thank you for joining SynapNote. We're excited to have you on board!</p>
        <p>You can now start creating and organizing your intelligent notes.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Getting Started:</h3>
          <ul>
            <li>Create your first note</li>
            <li>Organize notes with tags</li>
            <li>Use our smart search features</li>
          </ul>
        </div>
        <p>If you have any questions, feel free to reach out to our support team.</p>
  <p>Best regards,<br>The SynapNote Team</p>
      </div>
    `
  };

  return await sendEmail(mailOptions);
};

// Function to send password reset email
const sendPasswordResetEmail = async (to, resetToken, userName) => {
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    to,
  subject: 'Reset Your SynapNote Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello ${userName},</p>
  <p>We received a request to reset your password for your SynapNote account.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="background-color: #f5f5f5; padding: 10px; word-break: break-all;">${resetLink}</p>
        <p><strong>This link will expire in 1 hour for security reasons.</strong></p>
        <p>If you didn't request this password reset, please ignore this email.</p>
  <p>Best regards,<br>The SynapNote Team</p>
      </div>
    `
  };

  return await sendEmail(mailOptions);
};

// Export functions
export { 
  sendEmail, 
  sendWelcomeEmail, 
  sendPasswordResetEmail, 
  verifyTransporter 
};