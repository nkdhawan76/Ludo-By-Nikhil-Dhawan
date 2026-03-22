import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const TwilioConfig = () => {
    const [twilioStatus, setTwilioStatus] = useState(null);
    const [testPhone, setTestPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [testLoading, setTestLoading] = useState(false);

    const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
    const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
    const nodeMode = process.env.NODE_ENV;
    const baseUrl = nodeMode === "development" ? beckendLocalApiUrl : beckendLiveApiUrl;

    useEffect(() => {
        checkTwilioStatus();
    }, []);

    const checkTwilioStatus = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${baseUrl}twilio/status`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTwilioStatus(response.data);
        } catch (error) {
            console.error('Error checking Twilio status:', error);
            setTwilioStatus({
                success: false,
                twilioConfigured: false,
                message: 'Failed to check Twilio status'
            });
        } finally {
            setLoading(false);
        }
    };

    const sendTestSMS = async () => {
        if (!testPhone) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please enter a phone number'
            });
            return;
        }

        setTestLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${baseUrl}twilio/test`, 
                { phoneNumber: testPhone },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Test SMS sent successfully!'
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.message || 'Failed to send test SMS'
                });
            }
        } catch (error) {
            console.error('Error sending test SMS:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to send test SMS'
            });
        } finally {
            setTestLoading(false);
        }
    };

    return (
        <div className="row">
            <div className="col-12 grid-margin stretch-card">
                <div className="card corona-gradient-card">
                    <div className="card-body py-0 px-0 px-sm-3">
                        <div className="row align-items-center">
                            <div className="col-4 col-sm-3 col-xl-2">
                                <img
                                    src={`${baseUrl}assets/images/dashboard/Group126@2x.png`}
                                    className="gradient-corona-img img-fluid"
                                    alt=""
                                />
                            </div>
                            <div className="col-5 col-sm-7 col-xl-8 pl-0 pl-xl-8 pl-sm-6">
                                <div className="d-flex justify-content-between align-items-center pt-2">
                                    <div>
                                        <h4 className="mb-1 pb-0 text-white">
                                            Twilio SMS Configuration
                                        </h4>
                                        <p className="mb-0 pb-0 tx-light">
                                            Manage Twilio SMS settings for OTP delivery
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 grid-margin stretch-card">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Twilio Status</h4>
                        
                        {loading ? (
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                <p className="mt-2">Checking Twilio configuration...</p>
                            </div>
                        ) : (
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Configuration Status</label>
                                        <div className="d-flex align-items-center">
                                            <div className={`badge badge-${twilioStatus?.twilioConfigured ? 'success' : 'danger'} mr-2`}>
                                                {twilioStatus?.twilioConfigured ? 'Configured' : 'Not Configured'}
                                            </div>
                                            <button 
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={checkTwilioStatus}
                                            >
                                                Refresh
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label>Status Message</label>
                                        <p className="text-muted">{twilioStatus?.message}</p>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Test SMS</label>
                                        <div className="input-group">
                                            <input
                                                type="tel"
                                                className="form-control"
                                                placeholder="Enter phone number (e.g., 9876543210)"
                                                value={testPhone}
                                                onChange={(e) => setTestPhone(e.target.value)}
                                                maxLength="10"
                                            />
                                            <div className="input-group-append">
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={sendTestSMS}
                                                    disabled={testLoading || !twilioStatus?.twilioConfigured}
                                                >
                                                    {testLoading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm mr-2" role="status"></span>
                                                            Sending...
                                                        </>
                                                    ) : (
                                                        'Send Test SMS'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <small className="form-text text-muted">
                                            Send a test SMS to verify Twilio configuration
                                        </small>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-4">
                            <h5>Environment Variables Required</h5>
                            <div className="alert alert-info">
                                <p><strong>To configure Twilio, add these environment variables to your .env file:</strong></p>
                                <pre className="bg-dark text-light p-3 rounded">
{`TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here`}
                                </pre>
                                <p className="mb-0">
                                    <strong>Note:</strong> You can get these credentials from your Twilio Console dashboard.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h5>Features</h5>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>OTP Delivery via SMS</span>
                                    <span className="badge badge-success badge-pill">Active</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>Fallback to Fast2SMS</span>
                                    <span className="badge badge-info badge-pill">Enabled</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>Admin Login OTP</span>
                                    <span className="badge badge-success badge-pill">Active</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>User Registration OTP</span>
                                    <span className="badge badge-success badge-pill">Active</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TwilioConfig; 