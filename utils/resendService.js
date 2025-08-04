const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send booking confirmation email to customer
 */
const sendBookingConfirmation = async (bookingData) => {
  try {
    const { customerName, customerEmail, companyName, servicesInterested, preferredDate, _id } = bookingData;
    const servicesText = servicesInterested?.join(', ') || 'Consultation';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    if (!customerEmail) {
      console.error('No customer email provided');
      return { success: false, error: 'No customer email provided' };
    }

    console.log(`Sending confirmation email to: ${customerEmail}`);
    
    const emailData = {
      from: fromEmail,
      to: customerEmail,
      subject: 'Consultation Request Confirmation - Advanced TSP Services',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1>Thank You for Your Request</h1>
          </div>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>Hello ${customerName}!</h2>
            <p>We've received your consultation request and will contact you within 24 hours.</p>
            <h3>Your Details:</h3>
            <p><strong>Request ID:</strong> ${_id}</p>
            ${companyName ? `<p><strong>Company:</strong> ${companyName}</p>` : ''}
            <p><strong>Services:</strong> ${servicesText}</p>
            <p><strong>Date:</strong> ${new Date(preferredDate).toLocaleDateString()}</p>
          </div>
          <div style="text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px;">
            <p>Best regards,<br>${process.env.COMPANY_NAME || 'Advanced TSP Services'} Team</p>
          </div>
        </div>
      `
    };

    const result = await resend.emails.send(emailData);
    console.log('Confirmation email sent successfully:', result);
    return { success: true, emailId: result.data?.id };
  } catch (error) {
    console.error('Error sending confirmation email:', {
      error: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    return { success: false, error: error.message };
  }
};

/**
 * Send booking notification to admin
 */
const sendBookingNotificationToAdmin = async (bookingData) => {
  try {
    const { customerName, customerEmail, customerPhone, companyName, servicesInterested, preferredDate, _id } = bookingData;
    const adminEmail = process.env.ADMIN_EMAIL;
    
    if (!adminEmail) {
      console.error('ADMIN_EMAIL not set in environment variables');
      return { success: false, error: 'ADMIN_EMAIL not configured' };
    }

    console.log(`Sending admin notification to: ${adminEmail}`);
    
    const emailData = {
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: adminEmail,
      subject: `New Consultation - ${customerName}${companyName ? ` (${companyName})` : ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1>New Consultation Request</h1>
          </div>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>Customer Details</h2>
            <p><strong>Name:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Phone:</strong> ${customerPhone}</p>
            ${companyName ? `<p><strong>Company:</strong> ${companyName}</p>` : ''}
            <p><strong>Services:</strong> ${servicesInterested?.join(', ')}</p>
            <p><strong>Date:</strong> ${new Date(preferredDate).toLocaleDateString()}</p>
            <p><strong>Request ID:</strong> ${_id}</p>
          </div>
          <div style="text-align: center; margin-top: 30px; color: #6c757d; font-size: 14px;">
            <p>Please contact the customer within 24 hours.</p>
          </div>
        </div>
      `
    };

    const result = await resend.emails.send(emailData);
    console.log('Admin notification email sent successfully:', result);
    return { success: true, emailId: result.data?.id };
  } catch (error) {
    console.error('Error sending admin notification email:', {
      error: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    return { success: false, error: error.message };
  }
};

module.exports = { sendBookingConfirmation, sendBookingNotificationToAdmin };