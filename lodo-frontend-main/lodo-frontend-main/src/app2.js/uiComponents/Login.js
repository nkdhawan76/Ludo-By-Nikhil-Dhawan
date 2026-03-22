import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'

import '../css/layout.css'
import '../css/login.css'
import loginss from "./ss.png"
export default function Login() {

    const history = useHistory()


    const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
    const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
    const nodeMode = process.env.NODE_ENV;
    if (nodeMode === "development") {
        var baseUrl = beckendLocalApiUrl || "http://localhost:7010/";
    } else {
        baseUrl = beckendLiveApiUrl || "http://localhost:7010/";
    }

    const [WebSitesettings, setWebsiteSettings] = useState("");

    const fetchData = async () => {
        const response = await fetch(baseUrl + "settings/data");
        const data = await response.json();
        return setWebsiteSettings(data);
    }
    //console.log(WebSitesettings);
    useEffect(() => {
        fetchData();
    },[])

    const [Phone, setPhone] = useState();
    const [twofactor_code, settwofactor_code] = useState();
    const [otp, setOtp] = useState(false)
    const [secretCode, setSecretCode] = useState();
    const [referral, setReferral] = useState(useLocation().pathname.split("/")[2])

    const handleClick = async (e) => {
        e.preventDefault();

        if (!Phone) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter your phone number',

            });

        }
        else if (Phone.length !== 10) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please  enter currect phone number',

            });
        }
        else {
            await axios.post(baseUrl + `login`, {
                Phone, referral
            }).then((respone) => {
                if (respone.data.status === 101) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: respone.data.msg,
                    })
                }
                else if (respone.data.status === 200) {
                    setOtp(true)
                    // console.log(respone.data);
                    setSecretCode(respone.data.secret);
                    if (respone.data.myToken) {
                        Swal.fire({
                            icon: 'success',
                            title: 'OTP',
                            text: 'Demo Account Testing OTP: ' + respone.data.myToken,
                        })
                    }
                }
            })
                .catch((e) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong',
                        // width: '20%',
                        // height:'20%',
                    })
                })
        }
    }


    const varifyOtp = async (e) => {
        e.preventDefault();
        console.log('verify otp sumbut req');
        if (!Phone) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter your phone number',

            })
        } else {
            await axios.post(baseUrl + `login/finish`, {
                Phone,
                twofactor_code,
                referral,
                secretCode
            }).then((respone) => {

                if (respone.data.status === 101) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: respone.data.msg,
                    })
                }
                else if (respone.data.status === 200) {

                    const token = respone.data.token
                    localStorage.setItem("token", token)
                    window.location.reload(true)
                    setTimeout(function () {
                        history.push("/Games")
                    }, 1000);

                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                    })
                }
            })
                .catch((e) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                    })
                })
        }
    }

    const setError = () => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Invalid Number',
            confirmation: true,
        })
    }
    return (
        <>
        <div className='leftContainer' style={{ minHeight: '100vh', backgroundColor: '#000', position: 'relative' }}>
    <div className="main-area">
        <div className="splash-overlay" />
        {/* Background Image */}
        <div className="splash-screen">
            <img
                src={loginss}
                alt="background"
                style={{
                    width: '100%',
                    height: 'auto',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 0,
                }}
            />
        </div>

        {/* Content Area */}
        <div className="position-absolute w-100 center-xy mx-auto" style={{ top: '30%', zIndex: 9 }}>
            <div className="d-flex text-white font-18 justify-content-center mb-3" style={{ fontWeight: 'bold' }}>
                Sign in or Sign up
            </div>

            {/* Input Field */}
            <div className="bg-white px-3 py-2 d-flex align-items-center" style={{
                width: '75%',
                height: '55px',
                borderRadius: '8px',
                margin: '0 auto',
                border: '1px solid #ccc'
            }}>
                <div style={{
                    width: '50px',
                    textAlign: 'center',
                    color: '#000',
                    fontWeight: '500',
                    fontSize: '16px'
                }}>+91</div>
                <input
                    type="tel"
                    name="mobile"
                    placeholder="Mobile number"
                    className="form-control border-0"
                    style={{ fontSize: '16px' }}
                    onChange={(e) => {
                        setPhone(e.target.value);
                        if (e.target.value.length > 10) {
                            setError(true);
                        }
                    }}
                />
            </div>

            {/* OTP Field */}
            {otp && (
                <div className="bg-white px-3 py-2 d-flex align-items-center mt-3" style={{
                    width: '75%',
                    height: '55px',
                    borderRadius: '8px',
                    margin: '0 auto',
                    border: '1px solid #ccc'
                }}>
                    <div style={{
                        width: '50px',
                        textAlign: 'center',
                        color: '#000',
                        fontWeight: '500',
                        fontSize: '16px'
                    }}>OTP</div>
                    <input
                        type="tel"
                        name="otp"
                        placeholder="Enter OTP"
                        className="form-control border-0"
                        onChange={(e) => settwofactor_code(e.target.value)}
                    />
                </div>
            )}

            {/* Buttons */}
            {!otp ? (
                <button
                    className="btn btn-success w-75 mt-4 p-3 fw-bold"
                    onClick={handleClick}
                    style={{ borderRadius: '25px' }}
                >
                    CONTINUE
                </button>
            ) : (
                <button
                    className="btn btn-success w-75 mt-4 p-3 fw-bold"
                    onClick={varifyOtp}
                    style={{ borderRadius: '25px', fontSize:'20px' }}
                >
                    VERIFY
                </button>
            )}
        </div>

        {/* Footer */}
        <div className="login-footer text-white text-center px-4" style={{
            position: 'absolute',
            bottom: '20px',
            fontSize: '11px',
            lineHeight: '16px',
            width: '100%'
        }}>
            By proceeding, you agree to our <Link to="/term-condition">Terms of Use</Link>, <Link to="/PrivacyPolicy">Privacy Policy</Link> and that you are 18 years or older. You are not playing from Assam, Odisha, Nagaland, Sikkim, Meghalaya, Andhra Pradesh, Tamil Nadu or Telangana.
        </div>
    </div>
</div>

        </>
        // <>
        //     <div className='leftContainer' style={{ minHeight: '100vh' }}>
        //         <div className="main-area bg-dark">
        //             <div style={{ overflowY: 'hidden' }}>
        //                 <div className="splash-overlay" />
        //                 <div className="splash-screen animate__bounce infinite ">
        //                     <figure><img width="100%" src={loginss} style={{width: "auto"}} alt="" /></figure>
        //                 </div>
        //                 <div className="position-absolute w-100 center-xy mx-auto" style={{ top: '30%', zIndex: 9 }}>
        //                     <div className="d-flex text-white font-15 mb-4">Sign in</div>
        //                     <div className="bg-white px-3 cxy flex-column" style={{
        //                         width: '85%', height: '60px', borderRadius: '5px'
        //                     }}>
        //                         <div className="input-group mb-2 " style={{ transition: 'top 0.5s ease 0s', top: '5px' }}>
        //                             <div className="input-group-prepend">
        //                                 <div className="input-group-text" style={{ width: '100px', backgroundColor: '#e9ecef', border: '1px solid #d8d6de' }}>+91</div>
        //                             </div>
        //                             <input className="form-control" name="mobile" type="tel" placeholder="Mobile number"
        //                                 // onChange={(e) => setPhone(e.target.value)}
        //                                 onChange={(e) => {
        //                                     setPhone(e.target.value);
        //                                     if (e.target.value.length > 10) {
        //                                         setError(true)
        //                                     }
        //                                 }}
        //                                 style={{ transition: 'all 3s ease-out 0s', borderRadius: "4px" }}
        //                             />
        //                             {/* <div className="invalid-feedback">Enter a valid mobile number</div> */}
        //                         </div>

        //                     </div>
        //                     {otp && <div className="bg-white px-3 cxy flex-column" style={{
        //                         width: '85%', height: '60px', borderRadius: '5px', marginTop: "10px"
        //                     }}>

        //                         <div className="input-group mb-2" style={{ transition: 'top 0.5s ease 0s', top: '5px' }}>
        //                             <div className="input-group-prepend">
        //                                 <div className="input-group-text" style={{ width: '100px', backgroundColor: '#e9ecef', border: '1px solid #d8d6de' }}>OTP</div>
        //                             </div>
        //                             <input className="form-control" name="password" type="tel" placeholder="Enter OTP"
        //                                 onChange={(e) => settwofactor_code(e.target.value)}
        //                                 style={{ transition: 'all 3s ease-out 0s', borderRadius: "4px", border: '1px solid #d8d6de' }} />
        //                             {/* <div className="invalid-feedback">Enter a valid mobile number</div> */}
        //                         </div>

        //                     </div>}
        //                     {!otp && <button className="Login-button cxy mt-4" onClick={(e) => handleClick(e)} >Continue
        //                     </button>}
        //                     {otp && <button className="Login-button cxy mt-4" onClick={(e) => varifyOtp(e)} >Verify
        //                     </button>}

        //                 </div>
        //                 <div className="login-footer">By continuing I agree that {(WebSitesettings) ? WebSitesettings.CompanyName : ''}. may store and process my data in accordance with the <Link to="/term-condition">Terms of Use</Link>, <Link to="/PrivacyPolicy">Privacy Policy</Link> and that I am 18 years or older. I am not playing from
        //                     Assam, Odisha, Nagaland, Sikkim, Meghalaya, Andhra Pradesh, or Telangana.
        //                 </div>
        //             </div>
        //         </div>

        //     </div>

        // </>
    )
}