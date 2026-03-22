import React, { useEffect, useState } from 'react'
import "../css/layout.css"
import css from "../css/Profile.module.css"
import { Link, useHistory } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import axios from 'axios';
// import { Link, useHistory } from 'react-router-dom';
// import Profile from './Profile';
// import { Image } from 'react-bootstrap';

import Swal from 'sweetalert2';
import Header from '../Components/Header';


const Profile1 = () => {
    const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
    const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
    const nodeMode = process.env.NODE_ENV;
    if (nodeMode === "development") {
      var baseUrl = beckendLocalApiUrl;
    } else {
      baseUrl = beckendLiveApiUrl;
    }
      const [show, setShow] = useState(false);

    const [referral, setCode] = useState('')
    const [Id, setId] = useState(null)
    const [profile, setProfile] = useState()
    const [portcss, setPortcss] = useState(css.active_tab)
    const [portcss1, setPortcss1] = useState(css.inactive_tab)
    const [crushcss, setCrushcss] = useState(true)
    const [holder_name,setHolder_name]= useState();
    const [account_number,setAccount_number]=useState();
    const [ifsc_code,setIfsc_code]=useState();
    const [upi_id,setUpi_id]=useState();
    const history = useHistory()
    const logout = () => {
        let access_token = localStorage.getItem("token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.post(baseUrl+`logout`, {
            headers: headers
        }, { headers })
            .then((res) => {
                // setUser(res.data)
                localStorage.removeItem("token");
                //window.location.reload();
                history.push('/login')
                window.location.reload(true);
            }).catch((e) => {
                // alert(e.msg)
            })
    }
    const UserALL = () => {
        
        let access_token = localStorage.getItem("token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        axios.get(baseUrl+`me`, { headers })
            .then((res) => {
                setProfile(res.data)
                setId(res.data._id);
                TotalGame(res.data._id);
                setName(res.data.Name)
                setCode(res.data.referral)
                setHolder_name(res.data.holder_name);
                setAccount_number(res.data.account_number);
                setIfsc_code(res.data.ifsc_code);
                setUpi_id(res.data.upi_id);
            }).catch((e) => {
                // alert(e.msg)
            })
    }
    const [Name, setName] = useState()
    const UpdateProfile = async () => {
        const access_token = localStorage.getItem("token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        const data = await axios.patch(baseUrl+`user/edit`, {
            Name,
        }, { headers })
            .then((res) => {
               
                  if(res.data=="User name already exist!")
                {
                    Swal.fire({
                        title: res.data,
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
                else{
                    setName(res.data)
                    UserALL();
                }
            })
    }
    const updateBankDetails=async (e) => {
        e.preventDefault();
        const access_token = localStorage.getItem("token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        const data = await axios.patch(baseUrl+`user/edit`, {
           holder_name,account_number,ifsc_code,upi_id
        }, { headers })
            .then((res) => {
              
                if (res.status == 200) {
                    setShow(prev => !prev)
                    UserALL();
                    let message;
                    message = res.data.msg;
                    if (!(res.data.msg)) { 
                        message = 'something went wrong';
                    }
                    Swal.fire({
                        title: message,
                        icon: res.data.submit ? 'success' : 'error',
                        confirmButtonText: "OK",
                    });
                }
            })
    }
    const update_RefCode = async () => {
        const access_token = localStorage.getItem("token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        const data = await axios.patch(baseUrl+`user/edit`, {
            referral,
        }, { headers })
            .then((res) => {
           
                if (res.status == 200) {
                    UserALL();
                    let message;
                    message = res.data.msg;
                    if (!(res.data.msg)) {
                        message = 'Invalid referral Code';
                    }
                    Swal.fire({
                        title: message,
                        icon: res.data.submit ? 'success' : 'error',
                        confirmButtonText: "OK",
                    });
                }
            })
    }
    //// total game
    const [total, setTotal] = useState()
    const TotalGame = (Id) => {
        let access_token = localStorage.getItem("token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }

        axios.get(baseUrl+`total/user/all/${Id}`, { headers })
            .then((res) => {
                setTotal(res.data)

            }).catch((e) => {

            })
    }


    const [pic, setPic] = useState()
    const Result = async (file) => {
        if (file) {

            const access_token = localStorage.getItem("token")
            
            const headers = {
                Authorization: `Bearer ${access_token}`
            }

            const formData = new FormData();
            formData.append('avatar', file);


         
            await fetch(baseUrl+`users/me/avatar`, {
                method: "POST",
                body: formData,
                headers
            }).then((res) => {

                UserALL()
            })
        }
    }
    //avatar

    useEffect(() => {
        UserALL()

    }, [])


    return (
        <>
        {/* <Header user={profile} /> */}
        <div className="leftContainer mt-5" style={{ minHeight: '100vh', background: '#f5f6fa' }}>
          <div className="container py-4">
            {/* Profile Card */}
            <div className="card shadow-sm mb-4" style={{ borderRadius: '16px' }}>
              <div className="card-body d-flex flex-column align-items-center p-4">
                <label className="mb-2" style={{ cursor: 'pointer' }}>
                  <input className='d-none' type="file" onChange={(e) => Result(e.target.files[0])} accept="image/*" required />
                  <picture>
                    {profile && profile.avatar ? (
                      <img height="80px" width="80px" src={baseUrl + `${profile && profile.avatar}`} alt="" style={{ borderRadius: "50%", border: '3px solid #e0e0e0', objectFit: 'cover' }} />
                    ) : (
                      <img height="80px" width="80px" src={process.env.PUBLIC_URL + `/user.png`} alt="" style={{ borderRadius: "50%", border: '3px solid #e0e0e0', objectFit: 'cover' }} />
                    )}
                  </picture>
                </label>
                <div className="text-muted mt-2" style={{ fontSize: '0.95em', fontWeight: 500 }}>{profile && profile.Phone}</div>
                <div className="d-flex align-items-center mt-2">
                  <span className="font-weight-bold" style={{ fontSize: '1.2em' }}>{profile && profile.Name}</span>
                  <img className="ml-2" width="20px" src={process.env.PUBLIC_URL + '/Images/icon-edit.jpg'} alt="Edit" style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setPortcss(css.inactive_tab)
                      setPortcss1(css.active_tab)
                    }}
                  />
                </div>
                {/* Username Edit */}
                <div className={`mt-2 w-100 ${portcss1}`} style={{ maxWidth: 300 }}>
                  <div className="input-group">
                    <input aria-invalid="false" type="text" maxLength={'20'} className="form-control" placeholder="Enter Username"
                      value={Name}
                      onChange={(e) => {
                        setName(e.target.value)
                      }}
                    />
                    <div className="input-group-append">
                      <span className="input-group-text bg-white" style={{ cursor: 'pointer' }}
                        onClick={() => {
                          setPortcss(css.active_tab)
                          setPortcss1(css.inactive_tab)
                          UpdateProfile(Id)
                        }}>
                        <img width="20px" src={process.env.PUBLIC_URL + "/Images/select-blue-checkIcon.png"} alt="Save" />
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  className="btn mt-4 px-4 py-2 d-flex align-items-center gap-2 custom-wallet-btn bg-primary text-white"
                  style={{ 
                    borderRadius: 8, 
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: 'white'
                  }}
                  to="/wallet"
                >
                  <img width="28px" src={process.env.PUBLIC_URL + "/Images/sidebar-wallet.png"} alt="Wallet" className="mr-2" />
                  My Wallet
                </Link>
              </div>
            </div>

            {/* Complete Profile Card */}
            <div className="card shadow-sm mb-4" style={{ borderRadius: '16px' }}>
              <div className="card-body">
                <div className="font-weight-bold mb-3" style={{ fontSize: '1.1em' }}>Complete Profile</div>
                <Link className="d-flex align-items-center p-3 mb-2" style={{ borderRadius: 8, background: '#f8f9fa', textDecoration: 'none' }} to={(profile && profile.verified === `unverified`) ? `/Kyc2` : `/Profile`}>
                  <img width="32px" src={process.env.PUBLIC_URL + "/Images/kyc-icon-new.png"} alt="KYC" className="mr-3" />
                  <span style={{ fontWeight: 500 }}>
                    {profile && profile.verified === `unverified` ? 'Complete KYC' : profile && profile.verified === 'pending' ? 'In Process' : profile && profile.verified === 'verified' ? "Completed Kyc ✅" : "Completed Kyc ✅"}
                  </span>
                </Link>
              </div>
            </div>

            {/* Refer Code Card */}
            {profile && !profile.referral && (
              <div className="card shadow-sm mb-4" style={{ borderRadius: '16px' }}>
                <div className="card-body">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <img height="28px" width="28px" src={process.env.PUBLIC_URL + 'Images/Header/sreferEarn.png'} alt="Refer" className="mr-2" />
                    <span className="font-weight-bold" style={{ fontSize: '1em' }}>Use Refer Code</span>
                  </div>
                  <div className="input-group d-flex align-items-center gap-2" style={{ maxWidth: 300 }}>
                    <input type="text" className="form-control" value={referral} onChange={(e) => { setCode(e.target.value) }} placeholder="Enter refer code" />
                    <div className="input-group-append">
                      <button className="btn btn-link p-0 " style={{ color: '#007bff' }} onClick={update_RefCode}>
                        <img width="20px" src={process.env.PUBLIC_URL + "/Images/select-blue-checkIcon.png"} alt="Check" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Card */}
            <div className="card shadow-sm mb-4" style={{ borderRadius: '16px' }}>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-4 d-flex flex-column align-items-center">
                    <img height="32px" width="32px" src={process.env.PUBLIC_URL + "/Images/global-cash-won-green-circular.png"} alt="Cash Won" className="mb-2" />
                    <div className="text-muted" style={{ fontSize: '0.9em' }}>Cash Won</div>
                    <div className="font-weight-bold" style={{ fontSize: '1.1em' }}>
                      <img height="auto" width="18px" src={process.env.PUBLIC_URL + "/Images/global-rupeeIcon.png"} alt="₹" className="mr-1" />
                      {profile && profile.wonAmount}
                    </div>
                  </div>
                  <div className="col-4 d-flex flex-column align-items-center">
                    <img height="32px" width="32px" src={process.env.PUBLIC_URL + "/Images/global-purple-battleIcon.png"} alt="Battle Played" className="mb-2" />
                    <div className="text-muted" style={{ fontSize: '0.9em' }}>Battle Played</div>
                    <div className="font-weight-bold" style={{ fontSize: '1.1em' }}>{total && total}</div>
                  </div>
                  <div className="col-4 d-flex flex-column align-items-center">
                    <img height="32px" width="32px" src={process.env.PUBLIC_URL + "/Images/referral-signup-bonus-new.png"} alt="Referral Earning" className="mb-2" />
                    <div className="text-muted" style={{ fontSize: '0.9em' }}>Referral Earning</div>
                    <div className="font-weight-bold" style={{ fontSize: '1.1em' }}>{profile && profile.referral_earning}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="d-flex justify-content-center mb-5">
              <button className="btn btn-danger px-5 py-2 text-uppercase font-weight-bold" style={{ borderRadius: 8, letterSpacing: 1 }} onClick={logout}>
                Log Out
              </button>
            </div>
          </div>
        </div>
       
        {/* <ModalProfile style3={
                profileModalstyle
            } Enter={Enter}/> */}
            <div className={css.kyc_select} id="profileModal" >
                <div className={css.overlay} />
                <div
                    className={`${css.box}`}
                    style={{
                        bottom: '0px',
                        position: 'absolute',
                    }}
                >
                    <div className={css.bg_white}>
                        <div className={`${css.header} ${css.cxy} ${css.flex_column}`}>
                            <picture>
                                <img
                                    height="80px"
                                    width="80px"
                                    src={process.env.PUBLIC_URL + "/Images/avatars/Avatar2.png"}
                                    alt=""
                                />
                            </picture>
                            <div className={`${css.header_text} mt-2`}>Choose Avatar</div>
                        </div>
                        <div className="mx-3 pb-3" style={{ paddingTop: "200px" }}>
                            <div className="row justify-content-between col-10 mx-auto">
                                <img
                                    height="50px"
                                    width="50px"
                                    src={process.env.PUBLIC_URL + "/Images/avatars/Avatar1.png"}
                                    alt=""
                                />
                                <img
                                    height="50px"
                                    width="50px"
                                    src={process.env.PUBLIC_URL + "/Images/avatars/Avatar2.png"}
                                    alt=""
                                />
                                <img
                                    height="50px"
                                    width="50px"
                                    src={process.env.PUBLIC_URL + "/Images/avatars/Avatar3.png"}
                                    alt=""
                                />
                                <img
                                    height="50px"
                                    width="50px"
                                    src={process.env.PUBLIC_URL + "/Images/avatars/Avatar4.png"}
                                    alt=""
                                />
                            </div>
                            <div className="row justify-content-between col-10 mx-auto mt-3">
                                <img
                                    height="50px"
                                    width="50px"
                                    src={process.env.PUBLIC_URL + "/Images/avatars/Avatar5.png"}
                                    alt=""
                                />
                                <img
                                    height="50px"
                                    width="50px"
                                    src={process.env.PUBLIC_URL + "/Images/avatars/Avatar6.png"}
                                    alt=""
                                />
                                <img
                                    height="50px"
                                    width="50px"
                                    src={process.env.PUBLIC_URL + "/Images/avatars/Avatar7.png"}
                                    alt=""
                                />
                                <img
                                    height="50px"
                                    width="50px"
                                    src={process.env.PUBLIC_URL + "/Images/avatars/Avatar8.png"}
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Profile1;