const config = {
  REACT_APP_BACKEND_LOCAL_API: process.env.REACT_APP_BACKEND_LOCAL_API || 'http://localhost:7010/',
  REACT_APP_BACKEND_LIVE_API: process.env.REACT_APP_BACKEND_LIVE_API || 'https://api.ludowins.in/',
  REACT_APP_REFERRAL_COMMISSION_PERCENTATAGE: process.env.REACT_APP_REFERRAL_COMMISSION_PERCENTATAGE || '10'
};

export default config; 