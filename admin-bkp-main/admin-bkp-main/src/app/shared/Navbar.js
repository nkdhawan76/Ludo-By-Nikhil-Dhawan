import React, { Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Trans } from 'react-i18next';
import axios from 'axios';
import { baseUrl } from '../config';

class Navbar extends Component {

  logout = () => {
    const access_token = localStorage.getItem("token")
    const headers = {
      Authorization: `Bearer ${access_token}`
    }
    axios.post(baseUrl + `logout`, {
      headers: headers
    }, { headers })
      .then((res) => {
        console.log(res);
        // setUser(res.data)
        localStorage.removeItem("token", "user")
        window.location.reload()
        window.location.assign("/adminlogin")

      }).catch((e) => {
        if (e.response.status === 401) {
          localStorage.removeItem('token', "user");
          localStorage.removeItem('token', "user");
          window.location.assign("/adminlogin")
        }
      })

  }

  toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }
  toggleRightSidebar() {
    document.querySelector('.right-sidebar').classList.toggle('open');
  }
  render() {
    return (
      <nav className="navbar p-0 fixed-top d-flex flex-row">
        <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
          <button className="navbar-toggler align-self-center" type="button" onClick={() => document.body.classList.toggle('sidebar-icon-only')}>
            <span className="mdi mdi-menu"></span>
          </button>

          <ul className="navbar-nav w-100">
            <li className="nav-item w-100">
              <div className="page-title-header">
                <h5 style={{ 
                  margin: 0, 
                  fontFamily: 'Baloo 2',
                  color: '#1A1A2E', 
                  fontWeight: '700',
                  fontSize: '1.2rem'
                }}>
                  LudoWins Dashboard
                </h5>
              </div>
            </li>
          </ul>

          <ul className="navbar-nav navbar-nav-right">
            
            <Dropdown alignRight as="li" className="nav-item">
              <Dropdown.Toggle as="a" className="nav-link cursor-pointer no-caret">
                <div className="navbar-profile">
                  <img className="img-xs rounded-circle" src="https://ui-avatars.com/api/?name=Admin&background=00C853&color=fff" alt="profile" />
                   <p className="mb-0 d-none d-sm-block navbar-profile-name">
                     {this.props.usertype || 'Admin'}
                   </p>
                  <i className="mdi mdi-menu-down d-none d-sm-block"></i>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="navbar-dropdown preview-list navbar-profile-dropdown-menu">


                <Dropdown.Item onClick={() => this.logout()} className="preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle" style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="mdi mdi-logout text-white" style={{ fontSize: '1rem' }}></i>
                    </div>
                  </div>
                  <div className="preview-item-content" >
                    <p className="preview-subject mb-1">
                      <Trans>Log Out</Trans>
                    </p>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider style={{ borderColor: '#334155' }} />
                <Dropdown.Item className="preview-item">
                  <Link to={'/admin/update'} className="preview-thumbnail" style={{ textDecoration: 'none' }}>
                    <div className="preview-icon bg-dark rounded-circle" style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="mdi mdi-update text-white" style={{ fontSize: '1rem' }}></i>
                    </div>
                  </Link>
                  <Link  to={'/admin/update'} className="preview-item-content" style={{ textDecoration: 'none' }}>
                    <p className="preview-subject mb-1">
                      <Trans>Update Password</Trans>
                    </p>
                  </Link>
                </Dropdown.Item>
                <Dropdown.Divider style={{ borderColor: '#334155' }} />
                <Dropdown.Item className="preview-item">
                  <Link to={'/admin/profile'} className="preview-thumbnail" style={{ textDecoration: 'none' }}>
                    <div className="preview-icon bg-dark rounded-circle" style={{
                      background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="mdi mdi-account-circle text-white" style={{ fontSize: '1rem' }}></i>
                    </div>
                  </Link>
                  <Link  to={'/admin/profile'} className="preview-item-content" style={{ textDecoration: 'none' }}>
                    <p className="preview-subject mb-1">
                      <Trans>Profile</Trans>
                    </p>
                  </Link>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </ul>
          {/* <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" onClick={this.toggleOffcanvas} style={{
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid #334155',
            borderRadius: '8px',
            width: '40px',
            height: '40px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span className="mdi mdi-format-line-spacing" style={{ color: '#f8fafc' }}></span>
          </button> */}
        </div>
      </nav>
    );
  }
}

export default Navbar;
