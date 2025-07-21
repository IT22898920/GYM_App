import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  // For development, use ethereal email (fake email service)
  if (process.env.NODE_ENV === 'development') {
    return nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
      }
    });
  }

  // For production, configure with real email service
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Email templates
const emailTemplates = {
  gymApproved: (gymName, ownerName) => ({
    subject: `🎉 Your Gym Registration has been Approved - ${gymName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1>🎉 Congratulations!</h1>
          <h2>Your Gym Registration has been Approved</h2>
        </div>
        
        <div style="padding: 30px; background-color: #f8f9fa;">
          <h3>Dear ${ownerName},</h3>
          
          <p>We're excited to inform you that your gym <strong>"${gymName}"</strong> has been successfully approved and is now live on our platform!</p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4>What's Next?</h4>
            <ul>
              <li>✅ Your gym is now visible to customers</li>
              <li>✅ You can start receiving bookings</li>
              <li>✅ Access your gym dashboard to manage operations</li>
              <li>✅ Upload more photos and update your gym details</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/gym-owner" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
              Access Your Dashboard
            </a>
          </div>
          
          <p>If you have any questions or need support, please don't hesitate to contact our team.</p>
          
          <p>Welcome to FitConnect!</p>
          
          <p style="color: #6c757d; font-size: 14px;">
            Best regards,<br>
            The FitConnect Team
          </p>
        </div>
        
        <div style="background-color: #343a40; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>© 2024 FitConnect. All rights reserved.</p>
          <p>This email was sent regarding your gym registration on our platform.</p>
        </div>
      </div>
    `
  }),

  gymRejected: (gymName, ownerName, reason) => ({
    subject: `❌ Gym Registration Update - ${gymName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; color: white;">
          <h1>Gym Registration Update</h1>
          <h2>${gymName}</h2>
        </div>
        
        <div style="padding: 30px; background-color: #f8f9fa;">
          <h3>Dear ${ownerName},</h3>
          
          <p>Thank you for your interest in joining FitConnect. After careful review, we need to inform you that your gym registration for <strong>"${gymName}"</strong> requires some adjustments before approval.</p>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4>📝 Feedback from our team:</h4>
            <p>${reason || 'Please review and update your gym information to meet our platform standards.'}</p>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4>What you can do:</h4>
            <ul>
              <li>🔍 Review our gym listing requirements</li>
              <li>📝 Update your gym information accordingly</li>
              <li>📸 Add high-quality photos of your facilities</li>
              <li>🔄 Resubmit your application</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.CLIENT_URL}/gym-owner" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
              Update Your Registration
            </a>
          </div>
          
          <p>We're here to help you succeed. If you have any questions about the requirements or need assistance, please contact our support team.</p>
          
          <p style="color: #6c757d; font-size: 14px;">
            Best regards,<br>
            The FitConnect Team
          </p>
        </div>
        
        <div style="background-color: #343a40; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>© 2024 FitConnect. All rights reserved.</p>
          <p>This email was sent regarding your gym registration on our platform.</p>
        </div>
      </div>
    `
  }),

  gymPendingReview: (gymName, ownerName) => ({
    subject: `⏳ Gym Registration Received - ${gymName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px; text-align: center; color: white;">
          <h1>📋 Registration Received</h1>
          <h2>Thank you for joining FitConnect!</h2>
        </div>
        
        <div style="padding: 30px; background-color: #f8f9fa;">
          <h3>Dear ${ownerName},</h3>
          
          <p>Thank you for registering your gym <strong>"${gymName}"</strong> with FitConnect! We've successfully received your application.</p>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4>What happens next?</h4>
            <ul>
              <li>🔍 Our team will review your gym information</li>
              <li>✅ We'll verify your facilities and services</li>
              <li>📧 You'll receive approval notification within 2-3 business days</li>
              <li>🚀 Once approved, your gym will be live on our platform</li>
            </ul>
          </div>
          
          <div style="background-color: #e3f2fd; border: 1px solid #2196f3; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4>💡 Pro Tip:</h4>
            <p>While we review your application, you can prepare by gathering high-quality photos of your gym and thinking about special offers for new members!</p>
          </div>
          
          <p>If you have any questions during the review process, feel free to contact our support team.</p>
          
          <p style="color: #6c757d; font-size: 14px;">
            Best regards,<br>
            The FitConnect Team
          </p>
        </div>
        
        <div style="background-color: #343a40; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>© 2024 FitConnect. All rights reserved.</p>
          <p>This email was sent regarding your gym registration on our platform.</p>
        </div>
      </div>
    `
  })
};

// Send email function
export const sendEmail = async (to, template, data) => {
  try {
    const transporter = createTransporter();
    const emailTemplate = emailTemplates[template];
    
    if (!emailTemplate) {
      throw new Error('Email template not found');
    }

    const { subject, html } = emailTemplate(...data);

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"FitConnect" <noreply@fitconnect.com>',
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    
    // For development, log the preview URL
    if (process.env.NODE_ENV === 'development') {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return {
      success: true,
      messageId: info.messageId
    };

  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Specific email sending functions
export const sendGymApprovalEmail = async (ownerEmail, gymName, ownerName) => {
  return sendEmail(ownerEmail, 'gymApproved', [gymName, ownerName]);
};

export const sendGymRejectionEmail = async (ownerEmail, gymName, ownerName, reason) => {
  return sendEmail(ownerEmail, 'gymRejected', [gymName, ownerName, reason]);
};

export const sendGymPendingEmail = async (ownerEmail, gymName, ownerName) => {
  return sendEmail(ownerEmail, 'gymPendingReview', [gymName, ownerName]);
};