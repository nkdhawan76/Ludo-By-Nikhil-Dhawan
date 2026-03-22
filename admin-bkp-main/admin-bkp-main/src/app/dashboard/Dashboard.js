import React, { Component, useEffect, useState } from 'react';
import { baseUrl } from '../config';
// import { Doughnut } from 'react-chartjs-2';
import CountUp from 'react-countup';
import axios from 'axios';
// import Atropos from 'atropos';
// import 'atropos/css'
import "./Dashboard.css";
import { Link, useHistory } from 'react-router-dom';
import Conflictgame from './Conflictgame';

const $ = require("jquery")
$.Datatable = require("datatables.net");


const Dashboard = () => {


  const history = useHistory()

  const [Admin, setAdmin] = useState()
  const [today, setToday] = useState(false)
  const admin = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`total/admin`, { headers })
      .then((res) => {
        setAdmin(res.data)
      })
  }


  const [User, setUser] = useState()
  const user123 = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`total/user`, { headers })
      .then((res) => {
        setUser(res.data)
      })
  }

  const [ACTIVE, setACTIVE] = useState()
  const actives = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`total/active`, { headers })
      .then((res) => {
        setACTIVE(res.data)
      }).catch((e) => {
        if (e.response.status === 401) {

          localStorage.removeItem("token")
          history.push("/adminlogin")
          //place your reentry code
        }
      })
  }
  const [BLOCKED, setBLOCKED] = useState()
  useEffect(() => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`total/block`, { headers })
      .then((res) => {
        setBLOCKED(res.data)
      })
  }, [])



  // CHALLANGE OVERVIEW

  const [COMPLETED, setCOMPLETED] = useState()
  const comp = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`challange/completed`, { headers })
      .then((res) => {
        setCOMPLETED(res.data)
      })
  }

  const [ACTIVE1, setACTIVE1] = useState()
  const active = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`challange/active`, { headers })
      .then((res) => {
        setACTIVE1(res.data)
      })
  }

  const [ONGOING, setONGOING] = useState()
  const ongoings = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`challange/running`, { headers })
      .then((res) => {
        setONGOING(res.data)
      })
  }

  const [CANCELLED, setCANCELLED] = useState()
  const cancelled = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`challange/cancelled`, { headers })
      .then((res) => {
        setCANCELLED(res.data)
      })
  }

  // deposite api start


  const [totalDeposit, setTotalDeposit] = useState(0)
  const totalDepositfunc = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`total/deposit`, { headers })
      .then((res) => {
        setTotalDeposit(res.data)
      })
  }
  const [totalPending, setTotalPending] = useState(0)
  const totalPendingfunc = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`count/new/deposit`, { headers })
      .then((res) => {
        setTotalPending(res.data)
      })
  }
  const [totalRejected, setTotalRejected] = useState(0)
  const totalRejectedfunc = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`count/rejected/deposit`, { headers })
      .then((res) => {
        setTotalRejected(res.data)
      })
  }


  // deposite api end

  // withdrawl api start


  const [totalWithdrawl, setTotalWithdrawl] = useState(0)
  const totalWithdrawlfunc = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`total/withdraw`, { headers })
      .then((res) => {
        setTotalWithdrawl(res.data)
      })
  }
  const [totalPendingWithdrawl, setTotalPendingWithdrawl] = useState(0)
  const totalPendingWithdrawlfunc = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`count/new/withdrawl`, { headers })
      .then((res) => {
        setTotalPendingWithdrawl(res.data)
      })
  }
  const [totalRejectedWithdrawl, setTotalRejectedWithdrawl] = useState(0)
  const totalRejectedWithdrawlfunc = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`count/rejected/withdrawl`, { headers })
      .then((res) => {
        setTotalRejectedWithdrawl(res.data)
      })
  }


  // witdrawl api end

  const [Some, setSome] = useState()
  const Some1 = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`challange/some`, { headers })
      .then((res) => {
        setSome(res.data)
        $('table').dataTable();
      })
  }
  const [todayData, setTodayData] = useState();
  const todayApi= ()=>{
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.get(baseUrl+`all/user/data/get`, { headers })
      .then((res) => {
        setTodayData(res.data);
        //console.log(res.data);   
      })
      .catch((error)=>{
        console.log(error);
      })
  }

  useEffect(() => {
    comp()
    actives()
    user123()
    admin()
    active()
    ongoings()
    cancelled()
    totalDepositfunc();
    totalPendingfunc();
    totalWithdrawlfunc();
    totalPendingWithdrawlfunc();
    totalRejectedWithdrawlfunc();
    todayApi();
    // Some1()
  }, [])





  // CHALLANGE OVERVIEW

  return (
    <div className="dashboard-container p-3 animate__animated animate__fadeIn">
      <div className="d-flex justify-content-between align-items-center mb-4 lw-dashboard-header">
        <div>
           <h2 className="mb-1 font-weight-bold" style={{fontFamily: 'Baloo 2', color: '#1A1A2E'}}>Admin Dashboard</h2>
           <p className="text-secondary small mb-0">Welcome back! Here's a quick overview of your platform.</p>
        </div>
        <div className="custom-control custom-switch" >
          <input type="checkbox" className="custom-control-input" id="customSwitch1" onClick={()=>setToday(value => !value)} />
          <label className="custom-control-label font-weight-medium" htmlFor="customSwitch1" style={{color: '#1A1A2E'}}>
            {today==false?'OVERVIEW':'TODAY STATS'}
          </label>
        </div>
      </div>

      {!today&&<div className="animate__animated animate__fadeIn">
        {/* User Overview Section */}
        <div className="row mb-2">
           <div className="col-12"><h5 className="lw-section-title">User Overview</h5></div>
        </div>
        <div className="row">
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card lw-card-white border-bottom-success">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="lw-icon-box bg-soft-success">
                    <i className="mdi mdi-account-multiple text-success"></i>
                  </div>
                  <span className="text-secondary small">Total</span>
                </div>
                <h3 className="font-weight-bold mb-1">
                  <CountUp start={0} end={parseInt(User) || 0} duration={1} />
                </h3>
                <p className="mb-0 text-muted small">Registered Users</p>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card lw-card-white border-bottom-primary">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="lw-icon-box bg-soft-primary">
                    <i className="mdi mdi-account-check text-primary"></i>
                  </div>
                  <span className="text-secondary small">Live</span>
                </div>
                <h3 className="font-weight-bold mb-1">
                  <CountUp start={0} end={parseInt(ACTIVE) || 0} duration={1} />
                </h3>
                <p className="mb-0 text-muted small">Active Users</p>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card lw-card-white border-bottom-danger">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="lw-icon-box bg-soft-danger">
                    <i className="mdi mdi-account-remove text-danger"></i>
                  </div>
                  <span className="text-secondary small">Blocked</span>
                </div>
                <h3 className="font-weight-bold mb-1">
                  <CountUp start={0} end={parseInt(BLOCKED) || 0} duration={1} />
                </h3>
                <p className="mb-0 text-muted small">Restricted Users</p>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card lw-card-white border-bottom-warning">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="lw-icon-box bg-soft-warning">
                    <i className="mdi mdi-shield-account text-warning"></i>
                  </div>
                  <span className="text-secondary small">Admins</span>
                </div>
                <h3 className="font-weight-bold mb-1">
                  <CountUp start={0} end={parseInt(Admin) || 0} duration={1} />
                </h3>
                <p className="mb-0 text-muted small">Management Staff</p>
              </div>
            </div>
          </div>
        </div>

        {/* Conflict Games Section (Moved here for better flow) */}
        <Conflictgame />

        {/* Challenge Overview Section */}
        <div className="row mb-2 mt-4">
           <div className="col-12"><h5 className="lw-section-title">Challenge Analytics</h5></div>
        </div>
        <div className="row">
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card lw-card-white">
              <div className="card-body text-center">
                <p className="text-secondary mb-2">Completed</p>
                <h3 className="font-weight-bold text-success">
                  <CountUp start={0} end={COMPLETED || 0} duration={1} />
                </h3>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card lw-card-white">
              <div className="card-body text-center">
                <p className="text-secondary mb-2">Active</p>
                <h3 className="font-weight-bold text-primary">
                  <CountUp start={0} end={ACTIVE1 || 0} duration={1} />
                </h3>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card lw-card-white">
              <div className="card-body text-center">
                <p className="text-secondary mb-2">Ongoing</p>
                <h3 className="font-weight-bold text-warning">
                  <CountUp start={0} end={ONGOING || 0} duration={1} />
                </h3>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card lw-card-white">
              <div className="card-body text-center">
                <p className="text-secondary mb-2">Cancelled</p>
                <h3 className="font-weight-bold text-danger">
                  <CountUp start={0} end={CANCELLED || 0} duration={1} />
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Deposit Overview Section */}
        <div className="row mb-2 mt-4">
           <div className="col-12"><h5 className="lw-section-title">Finance: Deposits</h5></div>
        </div>
        <div className="row">
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card lw-card-white">
              <div className="card-body">
                <p className="text-secondary mb-2 small text-uppercase font-weight-bold">Total Request</p>
                <h4 className="font-weight-bold text-dark">
                  <CountUp start={0} end={totalDeposit?.count || 0} duration={1} />
                </h4>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card lw-card-gradient-gold text-white shadow-sm border-0">
              <div className="card-body">
                <p className="mb-2 opacity-75 small text-uppercase font-weight-bold">Total Amount</p>
                <h3 className="font-weight-bold">
                  ₹<CountUp start={0} end={totalDeposit?.data || 0} duration={1} />
                </h3>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card lw-card-white">
              <div className="card-body">
                <p className="text-secondary mb-2 small text-uppercase font-weight-bold">Pending</p>
                <h4 className="font-weight-bold text-warning">
                  <CountUp start={0} end={totalPending?.count || 0} duration={1} />
                </h4>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card lw-card-white">
              <div className="card-body">
                <p className="text-secondary mb-2 small text-uppercase font-weight-bold">Rejected</p>
                <h4 className="font-weight-bold text-danger">
                  <CountUp start={0} end={totalRejected?.count || 0} duration={1} />
                </h4>
              </div>
            </div>
          </div>
        </div>

        {/* Withdrawal Overview Section */}
        <div className="row mb-2 mt-4">
           <div className="col-12"><h5 className="lw-section-title">Finance: Withdrawals</h5></div>
        </div>
        <div className="row">
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card lw-card-white">
              <div className="card-body">
                <p className="text-secondary mb-2 small text-uppercase font-weight-bold">Total Request</p>
                <h4 className="font-weight-bold text-dark">
                  <CountUp start={0} end={totalWithdrawl?.count || 0} duration={1} />
                </h4>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card lw-card-gradient-gold text-white shadow-sm border-0">
              <div className="card-body">
                <p className="mb-2 opacity-75 small text-uppercase font-weight-bold">Total Amount</p>
                <h3 className="font-weight-bold">
                  ₹<CountUp start={0} end={totalWithdrawl?.data || 0} duration={1} />
                </h3>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card lw-card-white">
              <div className="card-body">
                <p className="text-secondary mb-2 small text-uppercase font-weight-bold">Pending</p>
                <h4 className="font-weight-bold text-warning">
                  <CountUp start={0} end={totalPendingWithdrawl?.count || 0} duration={1} />
                </h4>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card lw-card-white">
              <div className="card-body">
                <p className="text-secondary mb-2 small text-uppercase font-weight-bold">Rejected</p>
                <h4 className="font-weight-bold text-danger">
                  <CountUp start={0} end={totalRejectedWithdrawl?.count || 0} duration={1} />
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>}

      {today&&<div className="animate__animated animate__fadeIn">
        <div className="row mb-2">
           <div className="col-12"><h5 className="lw-section-title">Today's Performance</h5></div>
        </div>
        <div className="row">
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card lw-card-white">
              <div className="card-body">
                <p className="text-secondary mb-2">New Users</p>
                <h3 className="font-weight-bold text-dark">
                  <CountUp start={0} end={todayData?.todayUser || 0} duration={1} />
                </h3>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card lw-card-gradient-green text-white shadow-sm border-0">
              <div className="card-body">
                <p className="mb-2 opacity-75">Today's Games</p>
                <h3 className="font-weight-bold">
                  <CountUp start={0} end={todayData?.totalGame || 0} duration={1} />
                </h3>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card lw-card-white">
              <div className="card-body">
                <p className="text-secondary mb-2">Commission</p>
                <h3 className="font-weight-bold text-success">
                  ₹<CountUp start={0} end={todayData?.todayCommission || 0} duration={1} />
                </h3>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
            <div className="card lw-card-white">
              <div className="card-body">
                <p className="text-secondary mb-2">Today Deposits</p>
                <h3 className="font-weight-bold text-dark">
                  ₹<CountUp start={0} end={todayData?.todayTotalDeposit || 0} duration={1} />
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
           <div className="col-12">
              <div className="card lw-card-white shadow-sm border-0">
                 <div className="card-body py-4">
                    <h5 className="mb-4 font-weight-bold" style={{color: '#1A1A2E'}}>Financial Stats (Today)</h5>
                    <div className="row text-center">
                       <div className="col-md-3 border-right">
                          <p className="text-secondary small mb-1 uppercase font-weight-bold">Won Amount</p>
                          <h4 className="text-success mb-0">₹{todayData?.totolWonAmount || 0}</h4>
                       </div>
                       <div className="col-md-3 border-right">
                          <p className="text-secondary small mb-1 uppercase font-weight-bold">Lose Amount</p>
                          <h4 className="text-danger mb-0">₹{todayData?.totalLoseAmount || 0}</h4>
                       </div>
                       <div className="col-md-3 border-right">
                          <p className="text-secondary small mb-1 uppercase font-weight-bold">Hold Balance</p>
                          <h4 className="text-warning mb-0">₹{todayData?.totalHoldBalance || 0}</h4>
                       </div>
                       <div className="col-md-3">
                          <p className="text-secondary small mb-1 uppercase font-weight-bold">Wallet Balance</p>
                          <h4 className="text-primary mb-0">₹{todayData?.totalWalletbalance || 0}</h4>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>}
    </div>
  );
}

export default Dashboard;