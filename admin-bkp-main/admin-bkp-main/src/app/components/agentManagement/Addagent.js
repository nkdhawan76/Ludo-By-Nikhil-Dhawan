import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

export default function Addagent() {

  const history = useHistory()
  const [Name, setName] = useState()
  const [Phone, setPhone] = useState()
  const [Password, setPassword] = useState()
  const [cPassword, setCPassword] = useState()
  const [type, setType] = useState("Agent")
  const [referralCode, setReferralCode] = useState()
  const [commission, setCommission] = useState(10)

  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  if (nodeMode === "development") {
    var baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl;
  }

  const addAgent = async (e) => {
    e.preventDefault();

    if (Password !== cPassword) {
      alert("Passwords don't match");
    } else if (!Name || !Phone || !Password) {
      alert("Please fill all required fields");
    } else {
      try {
        const access_token = localStorage.getItem("token")
        const headers = {
          Authorization: `Bearer ${access_token}`
        }

        const data = await axios.post(baseUrl + "admin/register", {
          Name,
          Phone,
          Password,
          user_type: type,
          referral_code: referralCode,
          commission_percentage: commission
        }, { headers })

        if (data.status === 200) {
          alert("Agent added successfully!");
          history.push("/agent/allagents")
        }
      } catch (error) {
        console.log(error);
        alert("Error adding agent. Please try again.");
      }
    }
  }

  return (
    <div>
      <h4 className='text-uppercase font-weight-bold my-3 text-light'>Add New Agent</h4>

      <form id="add_agent_form" action="" method="post" style={{ backgroundColor: "rgba(0, 27, 11, 0.734)", padding: "20px", borderRadius: "10px" }}>
        <div className="form-row">
          <div className="form-group col-md-4">
            <label htmlFor="name" className="text-light">Name *</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="Enter Agent Name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="mobile" className="text-light">Mobile *</label>
            <input
              type="text"
              className="form-control"
              maxLength={10}
              id="mobile"
              name="mobile"
              placeholder="Enter Mobile Number"
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="type" className="text-light">User Type</label>
            <select
              className="form-control"
              name="type"
              id="type"
              onChange={(e) => setType(e.target.value)}
              value={type}
            >
              <option value="Agent">Agent</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-4">
            <label htmlFor="referral_code" className="text-light">Referral Code</label>
            <input
              type="text"
              className="form-control"
              id="referral_code"
              name="referral_code"
              placeholder="Enter Referral Code"
              onChange={(e) => setReferralCode(e.target.value)}
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="commission" className="text-light">Commission (%)</label>
            <input
              type="number"
              className="form-control"
              id="commission"
              name="commission"
              placeholder="Commission Percentage"
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
              min="0"
              max="100"
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="password" className="text-light">Password *</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-4">
            <label htmlFor="confirm_password" className="text-light">Confirm Password *</label>
            <input
              type="password"
              className="form-control"
              id="confirm_password"
              name="confirm_password"
              placeholder="Confirm Password"
              onChange={(e) => setCPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group col-md-8">
            <button
              type="submit"
              className="btn btn-success float-right"
              onClick={(e) => addAgent(e)}
              style={{ marginTop: "25px" }}
            >
              ADD AGENT
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
