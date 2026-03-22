import React, { useState, useEffect } from "react";

import axios from "axios";

const Gateway = () => {
  const [RazorPayout, setRazorpayout] = useState(true);
  const [RazorDeposit, setRazorDeposit] = useState(true);
  const [RazorpayAuto, setRazorpayAuto] = useState(false);
  const [RazorPayKey, setRazorpayKey] = useState();
  const [RazorPaySecretKey, setRazorpaysecretKey] = useState();
  const [AccountName, setAccountName] = useState();
  const [decentroPayout, setdecentropayout] = useState(true);
  const [decentroDeposit, setdecentroDeposit] = useState(true);
  const [decentroAuto, setdecentroAuto] = useState(false);
  const [settingId, setSettingId] = useState("");
  
  // UPI States
  const [UPIEnabled, setUPIEnabled] = useState(true);
  const [UPIGatewayKey, setUPIGatewayKey] = useState("");
  const [UPIGatewaySecret, setUPIGatewaySecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  if (nodeMode === "development") {
    var baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl;
  }

  useEffect(() => {
    const data = axios.get(baseUrl + "gatewaysettings/data", {}).then((res) => {
      console.log(res.data);
      setSettingId((res.data._id)?res.data._id:'');
      setRazorpayout(res.data.RazorPayout);
      setRazorDeposit(res.data.RazorDeposit);
      setRazorpayAuto(res.data.RazorpayAuto);
      setdecentropayout(res.data.decentroPayout);
      setdecentroDeposit(res.data.decentroDeposit);
      setdecentroAuto(res.data.decentroAuto);
      setRazorpayKey(res.data.RazorPayKey);
      setRazorpaysecretKey(res.data.RazorPaySecretKey);
      setAccountName(res.data.AccountName);
      
      // UPI Data
      setUPIEnabled(res.data.UPIEnabled !== undefined ? res.data.UPIEnabled : true);
      setUPIGatewayKey(res.data.UPIGatewayKey || "");
      setUPIGatewaySecret(res.data.UPIGatewaySecret || "");
    });
  }, []);

  const handleUPIToggle = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(baseUrl + "gatewaysettings/toggle-upi");
      if (response.data.status === 'success') {
        setUPIEnabled(response.data.data.UPIEnabled);
        alert(response.data.message);
      } else {
        alert("Failed to toggle UPI status");
      }
    } catch (error) {
      console.error("Error toggling UPI:", error);
      alert("Error toggling UPI status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit1 = async (e) => {
    e.preventDefault();

    const response = await axios.post(
      baseUrl + `gatewaysettings`,
      {
        settingId,
        RazorPayout,
        RazorDeposit,
        RazorpayAuto,
        decentroPayout,
        decentroDeposit,
        decentroAuto,
        RazorPayKey,
        RazorPaySecretKey,
        AccountName,
        UPIEnabled,
        UPIGatewayKey,
        UPIGatewaySecret,
      }
    );
    console.log(response.data.status);
    if(response.data.status==='success'){
      alert("Settings submitted successfully");
    }else{
      alert("Settings Not Submitted");
    }
  };

  return (
    <>
      <h4 className="text-uppercase font-weight-bold my-3">
        Payment Gateway Settings
      </h4>

      {/* UPI Section */}
      <h5 className="text-uppercase font-weight-bold my-3">UPI Gateway</h5>
      <form
        action="gatewaysettings"
        className="form"
        onSubmit={handleSubmit1}
        method="patch"
        enctype="multipart/form-date"
        style={{backgroundColor:"rgba(0, 27, 11, 0.734)", padding: "20px", borderRadius: "8px", marginBottom: "20px"}}
      >
        <div className="form-row">
          <div className="form-group col-md-6">
            <div className="d-flex align-items-center mb-3">
              <label className="mr-3 mb-0" style={{ minWidth: '120px', color: 'white' }}>
                UPI Status:
              </label>
              <button
                type="button"
                className={`btn ${UPIEnabled ? 'btn-success' : 'btn-danger'} ${isLoading ? 'disabled' : ''}`}
                onClick={handleUPIToggle}
                disabled={isLoading}
                style={{
                  minWidth: '100px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                ) : null}
                {UPIEnabled ? 'Active' : 'Disabled'}
              </button>
              <span className="ml-3 text-light">
                {UPIEnabled ? 'UPI payments are currently enabled' : 'UPI payments are currently disabled'}
              </span>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-4">
            <label htmlFor="UPIGatewayKey" style={{color: 'white'}}>UPI Gateway Key</label>
            <input
              className="form-control"
              type="text"
              value={UPIGatewayKey}
              onChange={(e) => setUPIGatewayKey(e.target.value)}
              placeholder="Enter UPI Gateway Key"
            />
          </div>

          {/* <div className="form-group col-md-4">
            <label htmlFor="UPIGatewaySecret" style={{color: 'white'}}>UPI Gateway Secret</label>
            <input
              className="form-control"
              type="text"
              value={UPIGatewaySecret}
              onChange={(e) => setUPIGatewaySecret(e.target.value)}
              placeholder="Enter UPI Gateway Secret"
            />
          </div> */}
        </div>

        <div className="form-row">
          <div className="form-group col-md-4">
            <button type="submit" className="btn btn-primary">
              Update UPI Settings
            </button>
          </div>
        </div>
      </form>

      <h5 className="text-uppercase font-weight-bold my-3">RazorPay</h5>

      <form
        action="gatewaysettings"
        className="form"
        onSubmit={handleSubmit1}
        method="patch"
        enctype="multipart/form-date"
      >
        <div className="form-row">
          <div className="form-group col-md-4">
            <label htmlFor="buttonrazpay" className="col-2 my-1">
              Razorpay Payout
            </label>
            <select
              className="form-control "
              name=""
              id=""
              value={RazorPayout}
              onChange={(e) => setRazorpayout(e.target.value)}
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>

            <label htmlFor="buttonrazdep" className="col-2 my-1">
            Razorpay Deposit
            </label>
            <select
              className="form-control "
              name=""
              id=""
              value={RazorDeposit}
              onChange={(e) => setRazorDeposit(e.target.value)}
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>

            <label htmlFor="buttonrazauto" className="col-2 my-1">
              RazorPay Auto
            </label>
            <select
              className="form-control"
              name=""
              id=""
              value={RazorpayAuto}
              onChange={(e) => setRazorpayAuto(e.target.value)}
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-4">
            <label htmlFor="RazorpayKey">RazorPay Key</label>
            <input
              className="form-control"
              type="text"
              value={RazorPayKey}
              onChange={(e) => setRazorpayKey(e.target.value)}
            />
          </div>

          <div className="form-group col-md-4">
            <label htmlFor="RazorpaysecretKey">RazorPay SecretKey</label>
            <input
              className="form-control"
              type="text"
              value={RazorPaySecretKey}
              onChange={(e) => setRazorpaysecretKey(e.target.value)}
            />
          </div>

          <div className="form-group col-md-4">
            <label htmlFor="AccountName">Account Name</label>
            <input
              className="form-control"
              type="text"
              value={AccountName}
              onChange={(e) => setAccountName(e.target.value)}
            />
          </div>
        </div>

        {/* <div className="form-row">
          <div className="form-group col-md-4">
            <h5 className="text-uppercase font-weight-bold my-3">Decentro</h5>

            <label htmlFor="buttondecpay" className="col-2 my-1">
              Decentro payout
            </label>
            <select
              className="form-control "
              name=""
              id=""
              value={decentroPayout}
              onChange={(e) => setdecentropayout(e.target.value)}
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>

            <label htmlFor="buttondecdep" className="col-2 my-1">
              Decentro Deposit
            </label>
            <select
              className="form-control "
              name=""
              id=""
              value={decentroDeposit}
              onChange={(e) => setdecentroDeposit(e.target.value)}
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>

            <label htmlFor="buttondecdep" className="col-2 my-1">
              Decentro Auto
            </label>
            <select
              className="form-control "
              name=""
              id=""
              value={decentroAuto}
              onChange={(e) => setdecentroAuto(e.target.value)}
            >
              <option value="true">Enable</option>
              <option value="false">Disable</option>
            </select>
          </div>
        </div> */}

        <div className="form-row">
          <div className="form-group col-md-4">
            <button type="submit" className="btn btn-dark">
              submit
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default Gateway;
