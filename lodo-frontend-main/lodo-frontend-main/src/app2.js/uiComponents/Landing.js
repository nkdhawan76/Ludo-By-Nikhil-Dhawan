import React, { useEffect, useState } from "react";
import axios from 'axios'
import {
    Link,
    //    NavLink, useHistory, useLocation 
} from 'react-router-dom'
//import Swal from "sweetalert2";
import '../css/landing.css'
import { Collapse } from 'react-bootstrap';
import './LandingAlerts.css';

import Downloadbutton from "../Components/Downloadbutton";
import Header from "../Components/Header";
const referralCommission = process.env.REACT_APP_REFERRAL_COMMISSION_PERCENTATAGE;

export default function Landing() {
    const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
    const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
    const nodeMode = process.env.NODE_ENV;
    var baseUrl;
    if (nodeMode === "development") {
        baseUrl = beckendLocalApiUrl;
    } else {
        baseUrl = beckendLiveApiUrl
    }
    const [open, setOpen] = useState(false);
    const [userAllData, setUserAllData] = useState();
    const [WebSitesettings, setWebsiteSettings] = useState("");
    const fetchData = async () => {
        const response = await fetch(baseUrl + "settings/data");
        const data = await response.json();
        return setWebsiteSettings(data);
    }

    const role = async () => {
        const access_token = localStorage.getItem("token")
        const headers = {
            Authorization: `Bearer ${access_token}`
        }
        await axios.get(baseUrl + `me`, { headers })
            .then((res) => {
                setUserAllData(res.data)
            })
            .catch(e => {
                if (e.response && e.response.status == 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('token');
                    //window.location.href = "/login";
                    //window.location.reload()
                    //history.push("/login")
                }
            })

    }

    useEffect(() => {
        let access_token = localStorage.getItem('token');
        access_token = localStorage.getItem('token');
        if (!access_token) {
            //window.location.reload()
        }
        role();
        fetchData();
    }, [])

    return (
        <>
            <Header user={userAllData} />
            <div className='leftContainer'>
                <div className='main-area' style={{ paddingTop: '60px' }}>


                </div>
                <section className="games-section p-3">
                    <div className="games-section-headline mt-2 mb-1">
                        <div className="games-window ">
                            <div className="row g-4 p-2">
                                <div className="col-6">
                                    <Link to="/Homepage/Ludo%20Classics" className="gameCard-container text-decoration-none position-relative d-block rounded-4 overflow-hidden shadow text-center">
                                        <span className="blink text-danger d-block text-start me-2 mt-2">◉ LIVE</span>
                                        <picture className="gameCard-image">
                                            <img src={process.env.PUBLIC_URL + '/Images/LandingPage_img/firstLudo.webp'} className="img-fluid rounded" alt="Ludo Classic" />
                                        </picture>
                                        <div className="gameCard-title mt-2 d-block">
                                            <span className="text-dark fw-bold">MANNUAL ROOM CODE</span>
                                            <p className="text-muted small">(LUDO CLASSIC)</p>
                                        </div>
                                        <div className="goverlay">
                                            <div className="text text-white">Coming Soon</div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-6">
                                    <Link to="/Homepage/Ludo%20Popular" className="gameCard-container text-decoration-none position-relative d-block rounded-4 overflow-hidden shadow text-center">
                                        <span className="blink text-danger d-block text-start me-2 mt-2">◉ LIVE</span>
                                        <picture className="gameCard-image">
                                            <img src={process.env.PUBLIC_URL + '/Images/LandingPage_img/secondLudo.webp'} className="img-fluid rounded" alt="Ludo Popular" />
                                        </picture>
                                        <div className="gameCard-title mt-2 d-block">
                                            <span className="text-dark fw-bold">MANNUAL ROOM CODE</span>
                                            <p className="text-muted small">(LUDO POPULAR)</p>
                                        </div>
                                        <div className="goverlay">
                                            <div className="text text-white">Coming Soon</div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-6">
                                    <Link to="/Homepage/Ludo%201%20Goti" className="gameCard-container text-decoration-none position-relative d-block rounded-4 overflow-hidden shadow text-center">
                                        <span className="blink text-danger d-block text-start me-2 mt-2">◉ LIVE</span>
                                        <picture className="gameCard-image">
                                            <img src={process.env.PUBLIC_URL + '/Images/LandingPage_img/thirdLudo.webp'} className="img-fluid rounded" alt="Snake Ladder" />
                                        </picture>
                                        <div className="gameCard-title mt-2 d-block">
                                            <span className="text-dark fw-bold">MANNUAL ROOM CODE</span>
                                            <p className="text-muted small">(SNAKE LADDER)</p>
                                        </div>
                                        <div className="goverlay">
                                            <div className="text text-white">Coming Soon</div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="footer">
                    <div className="footer-divider" />
                    <a className="px-3 py-4 d-flex align-items-center" href="#!" style={{ textDecoration: 'none' }} onClick={() => setOpen(!open)} aria-controls="example-collapse-text" aria-expanded={open}>
                        <picture className="icon" >
                            <img src={baseUrl + WebSitesettings.Logo} width="56px" height="56px" alt="profile" style={{ width: "56px", height: "56px" }} />
                        </picture>
                        <span style={{ color: 'rgb(149, 149, 149)', fontSize: '1em', fontWeight: 400 }} className={!open ? 'd-block' : 'd-none'}> . Terms, Privacy, Support</span>
                        {open ? <i className="mdi mdi-chevron-up ml-auto" style={{ fontSize: '1.7em', color: 'rgb(103, 103, 103)' }}></i> : <i style={{ fontSize: '1.7em', color: 'rgb(103, 103, 103)' }} className="mdi mdi-chevron-down ml-auto"></i>}
                    </a>
                    <Collapse in={open}>
                        <div id="example-collapse-text" className="px-3 overflow-hidden">
                            <div className="row footer-links">
                                <Link className="col-6" to="/term-condition">Terms &amp; Condition</Link>
                                <Link className="col-6" to="/PrivacyPolicy">Privacy Policy</Link>
                                <Link className="col-6" to="/RefundPolicy">Refund/Cancellation Policy</Link>
                                <Link className="col-6" to="/contact-us">Contact Us</Link>
                                <Link className="col-6" to="/responsible-gaming">Responsible Gaming</Link>
                            </div>
                        </div>
                    </Collapse>
                    <div className="footer-divider" />
                    <div className="px-3 py-4">
                        <div className="footer-text-bold">About Us</div><br />
                        <div className="footer-text">{(WebSitesettings) ? WebSitesettings.WebsiteName : ''} is a real-money gaming product owned and operated by {(WebSitesettings) ? WebSitesettings.CompanyName : ''} ("{(WebSitesettings) ? WebSitesettings.WebsiteName : ''}" or "We" or "Us" or "Our").</div><br />
                        <div className="footer-text-bold">Our Business &amp; Products</div><br />
                        <div className="footer-text">We are an HTML5 game-publishing company and our mission is to make accessing games
                            fast and easy by removing the friction of app-installs.</div><br />
                        <div className="footer-text">{(WebSitesettings) ? WebSitesettings.WebsiteName : ''} is a skill-based real-money gaming platform accessible only for our users
                            in India. It is accessible on <a target="_blank" rel="noopener noreferrer"
                                href={(WebSitesettings) ? WebSitesettings.CompanyWebsite : ''}>{(WebSitesettings) ? WebSitesettings.CompanyWebsite : ''}</a>. On {(WebSitesettings) ? WebSitesettings.WebsiteName : ''}, users can compete for real cash
                            in Tournaments and Battles. They can encash their winnings via popular options such as Paytm Wallet, Amazon
                            Pay, Bank Transfer, Mobile Recharges etc.</div><br />
                        <div className="footer-text-bold">Our Games</div><br />
                        <div className="footer-text">{(WebSitesettings) ? WebSitesettings.WebsiteName : ''} has a wide-variety of high-quality, premium HTML5 games. Our games are
                            especially compressed and optimised to work on low-end devices, uncommon browsers, and patchy internet
                            speeds.</div><br />
                        <div className="footer-text">We have games across several popular categories: Arcade, Action, Adventure, Sports
                            &amp; Racing, Strategy, Puzzle &amp; Logic. We also have a strong portfolio of multiplayer games such as
                            Ludo, Chess, 8 Ball Pool, Carrom, Tic Tac Toe, Archery, Quiz, Chinese Checkers and more! Some of our popular
                            titles are: Escape Run, Bubble Wipeout, Tower Twist, Cricket Gunda, Ludo With Friends. If you have any
                            suggestions around new games that we should add or if you are a game developer yourself and want to work
                            with us, don't hesitate to drop in a line at <a href={(WebSitesettings) ? 'mailto:' + WebSitesettings.CompanyEmail : ''}>{(WebSitesettings) ? WebSitesettings.CompanyEmail : ''}</a>!</div>
                    </div>
                </section>
                {/* <div className="downloadButton"  >
                    <Downloadbutton />
                </div> */}
            </div>
        </>
    )
}