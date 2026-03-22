const axios = require('axios');
const fs = require('fs');

async function testSMS() {
    try {
        const config = JSON.parse(fs.readFileSync('./config/default.json', 'utf8'));
        const { apiKey, senderId, gwid } = config.general.smsIndiaHub;
        
        const mobile = '919109992292'; // From user docs
        const otp = '1234';
        const msg = `Welcome to the xyz powered by SMSINDIAHUB. Your OTP for registration is ${otp}`;
        
        const url = `http://cloud.smsindiahub.in/vendorsms/pushsms.aspx?APIKey=${apiKey}&msisdn=${mobile}&sid=${senderId}&msg=${encodeURIComponent(msg)}&fl=0&gwid=${gwid}`;
        
        console.log('🚀 Sending SMS via URL:', url);
        
        const response = await axios.get(url);
        console.log('✅ Response Status:', response.status);
        console.log('✅ Response Data:', response.data);
    } catch (error) {
        console.error('❌ SMS Test Failed:', error.message);
        if (error.response) {
            console.error('❌ Error Data:', error.response.data);
        }
    }
}

testSMS();
