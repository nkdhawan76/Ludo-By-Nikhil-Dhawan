const twilio = require('twilio');
require('dotenv').config();

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client
const client = twilio(accountSid, authToken);

/**
 * Send OTP via Twilio SMS
 * @param {string} phoneNumber - Recipient phone number (with country code)
 * @param {string} otp - OTP code to send
 * @param {string} message - Custom message (optional)
 * @returns {Promise<Object>} - Twilio response
 */
const sendOTP = async (phoneNumber, otp, message = null) => {
    try {
        // Format phone number (add +91 if not present)
        let formattedPhone = phoneNumber;
        if (!phoneNumber.startsWith('+')) {
            formattedPhone = `+91${phoneNumber}`;
        }

        // Default message if not provided
        const defaultMessage = `Your OTP for login is: ${otp}. Please enter this code to verify your mobile number. Thank you!`;
        const smsMessage = message || defaultMessage;

        // Send SMS via Twilio
        const response = await client.messages.create({
            body: smsMessage,
            from: twilioPhoneNumber,
            to: formattedPhone
        });

        console.log(`✅ SMS sent successfully to ${formattedPhone}`);
        console.log(`📱 Message SID: ${response.sid}`);
        
        return {
            success: true,
            messageId: response.sid,
            status: response.status,
            to: formattedPhone
        };

    } catch (error) {
        console.error('❌ Error sending SMS via Twilio:', error.message);
        
        return {
            success: false,
            error: error.message,
            code: error.code
        };
    }
};

/**
 * Send custom SMS message
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} message - Message to send
 * @returns {Promise<Object>} - Twilio response
 */
const sendCustomSMS = async (phoneNumber, message) => {
    try {
        // Format phone number
        let formattedPhone = phoneNumber;
        if (!phoneNumber.startsWith('+')) {
            formattedPhone = `+91${phoneNumber}`;
        }

        // Send SMS
        const response = await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: formattedPhone
        });

        console.log(`✅ Custom SMS sent successfully to ${formattedPhone}`);
        
        return {
            success: true,
            messageId: response.sid,
            status: response.status
        };

    } catch (error) {
        console.error('❌ Error sending custom SMS:', error.message);
        
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Verify Twilio credentials
 * @returns {Promise<boolean>} - True if credentials are valid
 */
const verifyCredentials = async () => {
    try {
        if (!accountSid || !authToken || !twilioPhoneNumber) {
            console.error('❌ Twilio credentials not configured');
            return false;
        }

        // Test API call
        const account = await client.api.accounts(accountSid).fetch();
        console.log('✅ Twilio credentials verified successfully');
        console.log(`📞 Twilio Phone Number: ${twilioPhoneNumber}`);
        
        return true;

    } catch (error) {
        console.error('❌ Twilio credentials verification failed:', error.message);
        return false;
    }
};

/**
 * Get Twilio account information
 * @returns {Promise<Object>} - Account details
 */
const getAccountInfo = async () => {
    try {
        const account = await client.api.accounts(accountSid).fetch();
        
        return {
            success: true,
            accountSid: account.sid,
            accountName: account.friendlyName,
            status: account.status,
            phoneNumber: twilioPhoneNumber
        };

    } catch (error) {
        console.error('❌ Error fetching account info:', error.message);
        
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    sendOTP,
    sendCustomSMS,
    verifyCredentials,
    getAccountInfo
}; 