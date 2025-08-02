require('dotenv').config();
const { sendBookingConfirmation, sendBookingNotificationToAdmin } = require('./utils/resendService');

// Test booking data
const testBookingData = {
  _id: '507f1f77bcf86cd799439011',
  customerName: 'John Doe',
  customerEmail: 'john.doe@example.com',
  customerPhone: '+1-555-123-4567',
  serviceId: {
    name: 'Web Development'
  },
  subServiceSlug: 'e-commerce-website',
  task: 'Build a modern e-commerce website with payment integration and inventory management',
  date: new Date(),
  status: 'pending'
};

async function testResendEmails() {
  console.log('🧪 Testing Resend Email Service Integration');
  console.log('==========================================\n');
  
  // Check environment variables
  console.log('📋 Environment Check:');
  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || '❌ Missing');
  console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || '❌ Missing (will use FROM_EMAIL)');
  console.log('COMPANY_NAME:', process.env.COMPANY_NAME || '❌ Missing (will use default)');
  console.log('CONTACT_PERSON:', process.env.CONTACT_PERSON || '❌ Missing (will use default)');
  console.log();
  
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is required. Please add it to your .env file.');
    console.log('\n📝 To get your Resend API key:');
    console.log('1. Go to https://resend.com/');
    console.log('2. Sign up or log in');
    console.log('3. Go to API Keys section');
    console.log('4. Create a new API key');
    console.log('5. Add RESEND_API_KEY=your_api_key to .env file');
    return;
  }
  
  if (!process.env.RESEND_FROM_EMAIL) {
    console.error('❌ RESEND_FROM_EMAIL is required. Please add it to your .env file.');
    console.log('\n📝 Example: RESEND_FROM_EMAIL=bookings@yourdomain.com');
    console.log('Note: You need to verify your domain in Resend first.');
    return;
  }
  
  try {
    console.log('📧 Test 1: Sending customer confirmation email...');
    const customerResult = await sendBookingConfirmation(testBookingData);
    
    if (customerResult.success) {
      console.log('✅ Customer email sent successfully!');
      console.log('   Email ID:', customerResult.emailId);
    } else {
      console.log('❌ Customer email failed:', customerResult.error);
    }
    console.log();
    
    console.log('📧 Test 2: Sending admin notification email...');
    const adminResult = await sendBookingNotificationToAdmin(testBookingData);
    
    if (adminResult.success) {
      console.log('✅ Admin email sent successfully!');
      console.log('   Email ID:', adminResult.emailId);
    } else {
      console.log('❌ Admin email failed:', adminResult.error);
    }
    console.log();
    
    // Summary
    console.log('📊 Test Summary:');
    console.log('================');
    console.log('Customer Email:', customerResult.success ? '✅ Success' : '❌ Failed');
    console.log('Admin Email:', adminResult.success ? '✅ Success' : '❌ Failed');
    
    if (customerResult.success && adminResult.success) {
      console.log('\n🎉 All tests passed! Resend integration is working correctly.');
      console.log('\n📝 Next steps:');
      console.log('1. Check your email inbox (including spam folder)');
      console.log('2. Test creating a booking through your API');
      console.log('3. Monitor email delivery in Resend dashboard');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the errors above.');
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Verify your RESEND_API_KEY is correct');
    console.log('2. Ensure your domain is verified in Resend');
    console.log('3. Check that RESEND_FROM_EMAIL uses a verified domain');
    console.log('4. Make sure you have internet connection');
  }
}

// Run the test
testResendEmails().catch(console.error);
