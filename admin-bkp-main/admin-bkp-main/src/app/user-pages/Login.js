import React, { Component, useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import { Form } from "react-bootstrap";
import axios from "axios";

import { baseUrl } from '../config';
import './LoginModern.css';

const Login = () => {
  const history = useHistory();
  const [Phone, setPhone] = useState();
  const [twofactor_code, settwofactor_code] = useState();
  const [otp, setOtp] = useState(false);
  const [secretCode, setSecretCode] = useState();
  const [WebSitesettings, setWebsiteSettings] = useState("");

  const handleClick = async (e) => {
    e.preventDefault();
    if (!Phone) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter your phone number",
      });
    } else {
      await axios
        .post(baseUrl + `login/admin`, {
          Phone,
        })
        .then((respone) => {
          if (respone.data.status == 101) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: respone.data.msg,
            });
          } else if (respone.data.status == 200) {
            setOtp(true);
            setSecretCode(respone.data.secret);
            if (respone.data.myToken) {
              Swal.fire({
                icon: "success",
                title: "OTP",
                text: "OTP For Test Login: " + respone.data.myToken,
              });
            }
          }
        })
        .catch((e) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong",
          });
        });
    }
  };

  const varifyOtp = async (e) => {
    e.preventDefault();
    if (!Phone) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter your phone number",
      });
    } else {
      await axios
        .post(baseUrl + `login/admin/finish`, {
          Phone,
          twofactor_code,
          secretCode,
        })
        .then((respone) => {
          if (respone.data.status == 101) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: respone.data.msg,
            });
          } else if (respone.data.status == 200) {
            const token = respone.data.token;
            localStorage.setItem("token", token);
            history.push("/dashboard")
            window.location.reload(true);
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong!",
            });
          }
        })
        .catch((e) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        });
    }
  };

  const fetchData = () => {
    return fetch(baseUrl + "settings/data")
      .then((response) => response.json())
      .then((data) => setWebsiteSettings(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="login-modern-container">
      <div className="login-modern-card">
        <div className="login-header">
          {WebSitesettings.Logo && <img src={baseUrl + WebSitesettings.Logo} alt="Logo" style={{ height: '60px', marginBottom: '20px' }} />}
          <h2>{WebSitesettings.WebsiteName || 'Admin'} Panel</h2>
          <p>Login to your account to continue</p>
        </div>

        <form className="pt-3">
          <div className="modern-form-group">
            <label className="modern-label">Phone Number</label>
            <input
              type="text"
              placeholder="Enter 10 digit number"
              maxLength="10"
              className="modern-input"
              value={Phone || ''}
              onChange={(e) => setPhone(e.target.value)}
              disabled={otp}
            />
          </div>

          {otp && (
            <div className="modern-form-group otp-section">
              <label className="modern-label">OTP Verification</label>
              <input
                type="tel"
                placeholder="Enter 6-digit OTP"
                className="modern-input"
                onChange={(e) => settwofactor_code(e.target.value)}
                autoFocus
              />
            </div>
          )}

          {!otp ? (
            <button
              type="submit"
              className="modern-btn"
              onClick={(e) => handleClick(e)}
            >
              Sign In
            </button>
          ) : (
            <button
              type="submit"
              className="modern-btn"
              onClick={(e) => varifyOtp(e)}
            >
              Verify OTP
            </button>
          )
          }
        </form>
      </div>
    </div>
  );
};

export default Login;