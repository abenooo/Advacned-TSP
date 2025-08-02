const { Resend } = require('resend');

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send booking confirmation email to customer using Resend
 */
const sendBookingConfirmation = async (bookingData) => {
  try {
    console.log('📧 [Resend] Attempting to send booking confirmation email...');
    console.log('Resend API Key configured:', !!process.env.RESEND_API_KEY);
    console.log('From email:', process.env.RESEND_FROM_EMAIL);
    
    const { customerName, customerEmail, serviceId, subServiceSlug, task, date, _id } = bookingData;
    
    // Safely get service name
    const serviceName = serviceId && serviceId.name ? serviceId.name : (subServiceSlug || 'Service');
    
    const emailData = {
      from: process.env.RESEND_FROM_EMAIL || 'bookings@yourdomain.com',
      to: [customerEmail],
      subject: 'Booking Confirmation - Advanced TSP Services',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c3e50; margin-bottom: 10px;">Booking Confirmation</h1>
            <p style="color: #7f8c8d; font-size: 16px;">Thank you for choosing ${process.env.COMPANY_NAME || 'Advanced TSP Services'}</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <h2 style="color: #2c3e50; margin-top: 0; margin-bottom: 20px;">Hello ${customerName}!</h2>
            <p style="color: #495057; line-height: 1.6;">
              We have successfully received your booking request and our team will review it shortly. 
              You can expect to hear from us within 24 hours to confirm the details and schedule.
            </p>
          </div>
          
          <div style="background-color: #e8f5e8; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #155724; margin-top: 0; margin-bottom: 15px;">📋 Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Booking ID:</td>
                <td style="padding: 8px 0; color: #212529;">${_id}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Service:</td>
                <td style="padding: 8px 0; color: #212529;">${serviceName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Sub-service:</td>
                <td style="padding: 8px 0; color: #212529;">${subServiceSlug || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Task Description:</td>
                <td style="padding: 8px 0; color: #212529;">${task}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Requested Date:</td>
                <td style="padding: 8px 0; color: #212529;">${new Date(date).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Status:</td>
                <td style="padding: 8px 0; color: #ffc107; font-weight: bold;">Pending Review</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0; margin-bottom: 10px;">⏰ What's Next?</h3>
            <ul style="color: #856404; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Our team will review your request within 24 hours</li>
              <li>We'll contact you to confirm details and schedule</li>
              <li>You'll receive updates via email and phone</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="color: #6c757d; margin-bottom: 10px;">
              If you have any questions, please don't hesitate to contact us.
            </p>
            <p style="color: #495057; font-weight: bold; margin: 0;">
              Best regards,<br>
              ${process.env.COMPANY_NAME || 'Advanced TSP Services'} Team<br>
              <span style="color: #6c757d;">Contact: ${process.env.CONTACT_PERSON || 'Support Team'}</span>
            </p>
          </div>
        </div>
      `
    };
    
    console.log('📧 [Resend] Sending email to:', customerEmail);
    const result = await resend.emails.send(emailData);
    console.log('✅ [Resend] Booking confirmation email sent successfully!');
    console.log('Email ID:', result.data?.id);
    
    return { success: true, emailId: result.data?.id };
  } catch (error) {
    console.error('❌ [Resend] Error sending booking confirmation email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send booking notification email to admin using Resend
 */
const sendBookingNotificationToAdmin = async (bookingData) => {
  try {
    console.log('📧 [Resend] Attempting to send admin notification email...');
    
    const { customerName, customerEmail, customerPhone, serviceId, subServiceSlug, task, date, _id } = bookingData;
    
    // Use admin email or fallback to from email
    const adminEmail = process.env.ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL;
    console.log('Admin email:', adminEmail);
    
    // Safely get service name
    const serviceName = serviceId && serviceId.name ? serviceId.name : (subServiceSlug || 'Service');
    
    const emailData = {
      from: process.env.RESEND_FROM_EMAIL || 'bookings@yourdomain.com',
      to: [adminEmail],
      subject: `🔔 New Booking Request - ${customerName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #dc3545; margin-bottom: 10px;">🔔 New Booking Request</h1>
            <p style="color: #6c757d; font-size: 16px;">A new booking request has been submitted and requires your attention</p>
          </div>
          
          <div style="background-color: #f8d7da; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #dc3545;">
            <h2 style="color: #721c24; margin-top: 0; margin-bottom: 15px;">📋 Action Required</h2>
            <p style="color: #721c24; line-height: 1.6; margin: 0;">
              Please review this booking request and contact the customer within 24 hours to confirm details and schedule the service.
            </p>
          </div>
          
          <div style="background-color: #d4edda; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #155724; margin-top: 0; margin-bottom: 15px;">👤 Customer Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Name:</td>
                <td style="padding: 8px 0; color: #212529;">${customerName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0; color: #212529;"><a href="mailto:${customerEmail}" style="color: #007bff;">${customerEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Phone:</td>
                <td style="padding: 8px 0; color: #212529;"><a href="tel:${customerPhone}" style="color: #007bff;">${customerPhone}</a></td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #d1ecf1; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #17a2b8;">
            <h3 style="color: #0c5460; margin-top: 0; margin-bottom: 15px;">🛠️ Service Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Booking ID:</td>
                <td style="padding: 8px 0; color: #212529; font-family: monospace;">${_id}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Service:</td>
                <td style="padding: 8px 0; color: #212529;">${serviceName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Sub-service:</td>
                <td style="padding: 8px 0; color: #212529;">${subServiceSlug || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Requested Date:</td>
                <td style="padding: 8px 0; color: #212529;">${new Date(date).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold; vertical-align: top;">Task Description:</td>
                <td style="padding: 8px 0; color: #212529; line-height: 1.5;">${task}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0; margin-bottom: 10px;">⚡ Next Steps</h3>
            <ol style="color: #856404; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Review the booking details above</li>
              <li>Contact the customer within 24 hours</li>
              <li>Confirm service details and schedule</li>
              <li>Update booking status in the admin panel</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="color: #495057; font-weight: bold; margin: 0;">
              ${process.env.COMPANY_NAME || 'Advanced TSP Services'} Admin System<br>
              <span style="color: #6c757d; font-weight: normal;">Automated booking notification</span>
            </p>
          </div>
        </div>
      `
    };
    
    console.log('📧 [Resend] Sending admin notification to:', adminEmail);
    const result = await resend.emails.send(emailData);
    console.log('✅ [Resend] Admin notification email sent successfully!');
    console.log('Email ID:', result.data?.id);
    
    return { success: true, emailId: result.data?.id };
  } catch (error) {
    console.error('❌ [Resend] Error sending admin notification email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendBookingConfirmation,
  sendBookingNotificationToAdmin
};
