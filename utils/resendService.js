const { Resend } = require('resend');

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send booking confirmation email to customer using Resend
 */
const sendBookingConfirmation = async (bookingData) => {
  try {
    
    const { 
      customerName, 
      customerEmail, 
      companyName,
      companySize,
      industry,
      servicesInterested,
      serviceId, 
      subServiceSlug, 
      task, 
      message,
      preferredDate,
      preferredTime,
      hasITProvider,
      date, 
      _id 
    } = bookingData;
    
    // Safely get service name or services list
    const serviceName = serviceId && serviceId.name ? serviceId.name : (subServiceSlug || 'Consultation');
    const servicesText = servicesInterested && servicesInterested.length > 0 
      ? servicesInterested.join(', ') 
      : serviceName;
    const consultationMessage = message || task || 'No specific message provided';
    const consultationDate = preferredDate || date;
    const companyInfo = companyName ? `${companyName} (${companySize || 'Size not specified'})` : 'Individual consultation';
    
    const emailData = {
      from: process.env.RESEND_FROM_EMAIL || 'bookings@yourdomain.com',
      to: [customerEmail],
      subject: 'Consultation Request Confirmation - Advanced TSP Services',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c3e50; margin-bottom: 10px;">Consultation Request Confirmed</h1>
            <p style="color: #7f8c8d; font-size: 16px;">Thank you for choosing ${process.env.COMPANY_NAME || 'Advanced TSP Services'}</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <h2 style="color: #2c3e50; margin-top: 0; margin-bottom: 20px;">Hello ${customerName}!</h2>
            <p style="color: #495057; line-height: 1.6;">
              We have successfully received your consultation request and our team will review it shortly. 
              You can expect to hear from us within 24 hours to confirm the details and schedule your consultation.
            </p>
          </div>
          
          <div style="background-color: #e8f5e8; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #155724; margin-top: 0; margin-bottom: 15px;">📋 Consultation Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Request ID:</td>
                <td style="padding: 8px 0; color: #212529;">${_id}</td>
              </tr>
              ${companyName ? `
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Company:</td>
                <td style="padding: 8px 0; color: #212529;">${companyInfo}</td>
              </tr>
              ` : ''}
              ${industry ? `
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Industry:</td>
                <td style="padding: 8px 0; color: #212529;">${industry}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Services of Interest:</td>
                <td style="padding: 8px 0; color: #212529;">${servicesText}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Preferred Date:</td>
                <td style="padding: 8px 0; color: #212529;">${new Date(consultationDate).toLocaleDateString()}</td>
              </tr>
              ${preferredTime ? `
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Preferred Time:</td>
                <td style="padding: 8px 0; color: #212529;">${preferredTime}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Current IT Provider:</td>
                <td style="padding: 8px 0; color: #212529;">${hasITProvider || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Status:</td>
                <td style="padding: 8px 0; color: #ffc107; font-weight: bold;">Pending Review</td>
              </tr>
            </table>
          </div>
          
          ${consultationMessage !== 'No specific message provided' ? `
          <div style="background-color: #d1ecf1; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #17a2b8;">
            <h3 style="color: #0c5460; margin-top: 0; margin-bottom: 15px;">💬 Your Message</h3>
            <p style="color: #0c5460; line-height: 1.6; margin: 0;">${consultationMessage}</p>
          </div>
          ` : ''}
          
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
    
    const result = await resend.emails.send(emailData);
    
    return { success: true, emailId: result.data?.id };
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send booking notification email to admin using Resend
 */
const sendBookingNotificationToAdmin = async (bookingData) => {
  try {
    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      companyName,
      companySize,
      industry,
      servicesInterested,
      serviceId, 
      subServiceSlug, 
      task, 
      message,
      preferredDate,
      preferredTime,
      hasITProvider,
      date, 
      _id 
    } = bookingData;
    
    // Use admin email or fallback to from email
    const adminEmail = process.env.ADMIN_EMAIL || process.env.RESEND_FROM_EMAIL;
    
    // Safely get service name or services list
    const serviceName = serviceId && serviceId.name ? serviceId.name : (subServiceSlug || 'Consultation');
    const servicesText = servicesInterested && servicesInterested.length > 0 
      ? servicesInterested.join(', ') 
      : serviceName;
    const consultationMessage = message || task || 'No specific message provided';
    const consultationDate = preferredDate || date;
    const companyInfo = companyName ? `${companyName} (${companySize || 'Size not specified'})` : 'Individual consultation';
    
    const emailData = {
      from: process.env.RESEND_FROM_EMAIL || 'bookings@yourdomain.com',
      to: [adminEmail],
      subject: `🔔 New Consultation Request - ${customerName}${companyName ? ` (${companyName})` : ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #dc3545; margin-bottom: 10px;">🔔 New Consultation Request</h1>
            <p style="color: #6c757d; font-size: 16px;">A new consultation request has been submitted and requires your attention</p>
          </div>
          
          <div style="background-color: #f8d7da; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #dc3545;">
            <h2 style="color: #721c24; margin-top: 0; margin-bottom: 15px;">📋 Action Required</h2>
            <p style="color: #721c24; line-height: 1.6; margin: 0;">
              Please review this consultation request and contact the customer within 24 hours to confirm details and schedule the consultation.
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
              ${companyName ? `
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Company:</td>
                <td style="padding: 8px 0; color: #212529;">${companyInfo}</td>
              </tr>
              ` : ''}
              ${industry ? `
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Industry:</td>
                <td style="padding: 8px 0; color: #212529;">${industry}</td>
              </tr>
              ` : ''}
            </table>
          </div>
          
          <div style="background-color: #d1ecf1; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #17a2b8;">
            <h3 style="color: #0c5460; margin-top: 0; margin-bottom: 15px;">🛠️ Consultation Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Request ID:</td>
                <td style="padding: 8px 0; color: #212529; font-family: monospace;">${_id}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Services of Interest:</td>
                <td style="padding: 8px 0; color: #212529;">${servicesText}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Preferred Date:</td>
                <td style="padding: 8px 0; color: #212529;">${new Date(consultationDate).toLocaleDateString()}</td>
              </tr>
              ${preferredTime ? `
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Preferred Time:</td>
                <td style="padding: 8px 0; color: #212529;">${preferredTime}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #495057; font-weight: bold;">Current IT Provider:</td>
                <td style="padding: 8px 0; color: #212529;">${hasITProvider || 'Not specified'}</td>
              </tr>
            </table>
          </div>
          
          ${consultationMessage !== 'No specific message provided' ? `
          <div style="background-color: #fff3cd; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0; margin-bottom: 15px;">💬 Customer Message</h3>
            <p style="color: #856404; line-height: 1.6; margin: 0;">${consultationMessage}</p>
          </div>
          ` : ''}
          
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
    
    const result = await resend.emails.send(emailData);
    
    return { success: true, emailId: result.data?.id };
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendBookingConfirmation,
  sendBookingNotificationToAdmin
};
