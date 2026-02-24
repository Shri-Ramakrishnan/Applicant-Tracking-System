const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"ATS System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Email error: ${error.message}`);
    // Non-blocking - log error but don't crash
  }
};

const sendShortlistEmail = async (applicantEmail, applicantName, jobTitle) => {
  await sendEmail({
    to: applicantEmail,
    subject: `Congratulations! You've been shortlisted for ${jobTitle}`,
    html: `<h2>Dear ${applicantName},</h2>
           <p>We are pleased to inform you that you have been <strong>shortlisted</strong> for the position of <strong>${jobTitle}</strong>.</p>
           <p>Our team will contact you shortly with further details.</p>
           <p>Best regards,<br/>ATS Recruitment Team</p>`
  });
};

const sendInterviewEmail = async (applicantEmail, applicantName, jobTitle, interviewDate, mode) => {
  await sendEmail({
    to: applicantEmail,
    subject: `Interview Scheduled for ${jobTitle}`,
    html: `<h2>Dear ${applicantName},</h2>
           <p>Your interview for <strong>${jobTitle}</strong> has been scheduled.</p>
           <p><strong>Date & Time:</strong> ${new Date(interviewDate).toLocaleString()}</p>
           <p><strong>Mode:</strong> ${mode}</p>
           <p>Please be prepared and available at the scheduled time.</p>
           <p>Best regards,<br/>ATS Recruitment Team</p>`
  });
};

const sendOfferEmail = async (applicantEmail, applicantName, jobTitle, salary, joiningDate) => {
  await sendEmail({
    to: applicantEmail,
    subject: `Job Offer - ${jobTitle}`,
    html: `<h2>Dear ${applicantName},</h2>
           <p>We are delighted to offer you the position of <strong>${jobTitle}</strong>.</p>
           <p><strong>Salary:</strong> $${salary.toLocaleString()} per annum</p>
           <p><strong>Joining Date:</strong> ${new Date(joiningDate).toLocaleDateString()}</p>
           <p>Please log in to your account to accept or reject this offer.</p>
           <p>Best regards,<br/>ATS Recruitment Team</p>`
  });
};

module.exports = { sendShortlistEmail, sendInterviewEmail, sendOfferEmail };
