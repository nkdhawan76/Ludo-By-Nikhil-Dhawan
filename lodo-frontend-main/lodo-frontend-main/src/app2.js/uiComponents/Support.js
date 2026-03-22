import React, { useEffect, useState } from "react";

const Support = () => {
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const nodeMode = process.env.NODE_ENV;

  var baseUrl;
  if (nodeMode === "development") {
    baseUrl = beckendLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl
  }

  const [WebSitesettings, setWebsiteSettings] = useState("");
    const fetchData = async () => {
      const response = await fetch(baseUrl + "settings/data");
      const data = await response.json();
      return setWebsiteSettings(data);
    }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div>
      <div className="leftContainer" style={{ minHeight: '100vh', height: '100%' }}>



        <div className="cxy flex-column " style={{ paddingTop: "16%" }}>
          <img src={process.env.PUBLIC_URL + '/Images/contact_us.png'} width="280px" alt="" />
          <div className="games-section-title mt-4" style={{ fontSize: "1.2em", fontWeight: '700', color: '2c2c2c' }}>
            Contact us at below platforms.
          </div>
          {/*
          <div className="row justify-content-center">
          <div className="col-4  d-flex justify-content-around w-80">
          <a className="cxy flex-column" href="https://t.me/JAIPURLUDOAPP">
            <img width="50px" src={process.env.PUBLIC_URL + '/Images/tel.png'} alt="" />
            <span className="footer-text-bold">Telegram @JAIPURLUDOAPP</span>
          </a>
        </div>
          </div>
          
           
         <div className="row justify-content-center">
          <div className="col-4  d-flex justify-content-around w-80">
              <a className="cxy flex-column" href="https://www.instagram.com/jaipurludoapp/">
              <img width="50px" src={process.env.PUBLIC_URL + '/Images/instagram.png'} alt="" />
                <span className="footer-text-bold">Instagram</span>
              </a>
            </div>
          </div>
          
          <div className="col-12 my-2 text-center font-weight-bold">
          <a className="cxy flex-column" href="https://api.whatsapp.com/send?phone=+918290429001&text=Hello">
              <img width="50px" src={process.env.PUBLIC_URL + '/Images/whatsapp.png'} alt="" />
              <span className="footer-text-bold">+918290429001</span>
            </a>
          </div>
          */}
          <div className="col-12 my-2 text-center font-weight-bold">
            <a className="cxy flex-column" href={(WebSitesettings.CompanyEmail) ? 'mailto:'+WebSitesettings.CompanyEmail : ''}>
              <img width="50px" src={process.env.PUBLIC_URL + '/Images/mail.png'} alt="" />
              <span className="footer-text-bold">{(WebSitesettings.CompanyEmail) ? WebSitesettings.CompanyEmail : ''}</span>
            </a>
          </div>
          
          <div className="col-12 my-2 text-center font-weight-bold">
            <a className="cxy flex-column" href="#">
            <span className="footer-text-bold"><a href={(WebSitesettings.CompanyMobile) ? 'tel:'+WebSitesettings.CompanyMobile : ''}>{(WebSitesettings.CompanyMobile) ? WebSitesettings.CompanyMobile : ''}</a></span>
              <span className="footer-text-bold">{(WebSitesettings) ? WebSitesettings.CompanyName : ''}</span>
              <span className="footer-text-bold">
              {(WebSitesettings) ? WebSitesettings.CompanyAddress : ''}</span>
            </a>
          </div>

        </div>
      </div>
     
    </div>
  );
};

export default Support;