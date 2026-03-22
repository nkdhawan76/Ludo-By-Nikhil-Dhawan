const axios = require('axios');
const config = require('config');

const smsConfig = config.get('general.smsIndiaHub');

/**
 * Send OTP via SMSHub India
 * @param {string} phoneNumber - Recipient phone number
 * @param {string} otp - OTP code
 * @returns {Promise<Object>} - Response object
 */
const sendOTP = async (phoneNumber, otp) => {
    try {
        const apiKey = smsConfig.apiKey;
        const senderId = smsConfig.senderId;
        const gwid = smsConfig.gwid;
        
        // Ensure phone number doesn't have +91 if the API expects just 10 digits or 91 format
        // Based on the example msisdn=919109992292, it seems to prefer 91 prefix.
        let formattedPhone = phoneNumber;
        if (phoneNumber.startsWith('+')) {
            formattedPhone = phoneNumber.substring(1);
        } else if (phoneNumber.length === 10) {
            formattedPhone = `91${phoneNumber}`;
        }

        const msg = `Welcome to the Ludo Wins powered by SMSINDIAHUB. Your OTP for registration is ${otp}`;
        
        const url = `http://cloud.smsindiahub.in/vendorsms/pushsms.aspx?APIKey=${apiKey}&msisdn=${formattedPhone}&sid=${senderId}&msg=${encodeURIComponent(msg)}&fl=0&gwid=${gwid}`;

        const response = await axios.get(url);
        
        console.log(`✅ SMS sent successfully to ${formattedPhone} via SMSHub India`);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('❌ Error sending SMS via SMSHub India:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    sendOTP
};
