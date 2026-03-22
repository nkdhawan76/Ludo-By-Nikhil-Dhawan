import React, { Component, useEffect, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Collapse, Dropdown } from 'react-bootstrap';
import { Trans } from 'react-i18next';
import axios from 'axios';



class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }



  toggleMenuState(menuState) {
    if (this.state[menuState]) {
      this.setState({ [menuState]: false });
    } else if (Object.keys(this.state).length === 0) {
      this.setState({ [menuState]: true });
    } else {
      Object.keys(this.state).forEach(i => {
        this.setState({ [i]: false });
      });
      this.setState({ [menuState]: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    document.querySelector('#sidebar').classList.remove('active');
    Object.keys(this.state).forEach(i => {
      this.setState({ [i]: false });
    });

    const dropdownPaths = [
      { path: '/apps', state: 'appsMenuOpen' },
      { path: '/admin', state: 'adminMenu' },
      { path: '/game', state: 'gameMenu' },
      { path: '/user', state: 'userMenu' },
      { path: '/agent', state: 'agentMenu' },
      { path: '/challenge', state: 'challengeMenu' },
      { path: '/transaction', state: 'transactionMenu' },
      { path: '/basic-ui', state: 'basicUiMenuOpen' },
      { path: '/form-elements', state: 'formElementsMenuOpen' },
      { path: '/tables', state: 'tablesMenuOpen' },
      { path: '/icons', state: 'iconsMenuOpen' },
      { path: '/charts', state: 'chartsMenuOpen' },
      { path: '/user-pages', state: 'userPagesMenuOpen' },
      { path: '/error-pages', state: 'errorPagesMenuOpen' },
      { path: '/Reports', state: 'reportsMenu' },//Added By Team 
    ];

    dropdownPaths.forEach((obj => {
      if (this.isPathActive(obj.path)) {
        this.setState({ [obj.state]: true })
      }
    }));
  }

  render() {
    var appURL = process.env.PUBLIC_URL;
    var logo = appURL + 'https://img.icons8.com/dotty/512/admin-settings-male.png';
    // foreach props
    for (let key in this.props) {
      if (this.props[key] === undefined) {
        setTimeout(() => {

        }, 1000);
      }
    }


    return (

      <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
          <Link className="brand-logo" to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '1.8rem', marginRight: '8px' }}>🎲</span>
            <span style={{ 
              fontFamily: 'Baloo 2', 
              fontSize: '1.6rem', 
              fontWeight: '800', 
              background: 'linear-gradient(135deg, #00C853, #B2FF59)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>LudoWins</span>
          </Link>
          <Link className="sidebar-brand brand-logo-mini" to="/dashboard" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '1.5rem' }}>🎲</span>
          </Link>
        </div>

        <ul className="nav">
          <li className={this.isPathActive('/admin/profile') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
            <Link className="nav-link" to="/admin/profile">
              <span className="menu-icon">
                <i className="mdi mdi-account-circle-outline"></i>
              </span>
              <span className="menu-title">
                {this.props.usertype || 'Admin'}
              </span>
            </Link>
          </li>

          <li className="nav-item nav-category" style={{ marginBottom: '1rem' }}>
            <span className="nav-link" style={{
              color: '#64748b',
              fontSize: '0.75rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '0.5rem 1rem'
            }}>
              <Trans>Navigation</Trans>
            </span>
          </li>
          {this.props.dashboard &&
           (
            <li className={this.isPathActive('/dashboard') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
              <Link className="nav-link" to="/dashboard">
                <span className="menu-icon" style={{ marginRight: '0.75rem' }}>
                  <i className="mdi mdi-speedometer" style={{ fontSize: '1.1rem' }}></i>
                </span>
                <span className="menu-title" style={{ fontWeight: '500' }}>
                  <Trans>Dashboard</Trans>
                </span>
              </Link>
            </li>
          )}
          {this.props.earnings && (
            <li className={this.isPathActive('/earinigs') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
              <Link className="nav-link" to="/earinigs">
                <span className="menu-icon" style={{ marginRight: '0.75rem' }}>
                  <i className="mdi mdi-cash-usd" style={{ fontSize: '1.1rem' }}></i>
                </span>
                <span className="menu-title" style={{ fontWeight: '500' }}>
                  <Trans> Admin Earnings</Trans>
                </span>
              </Link>
            </li>
          )}
          {(this.props.allAdmins || this.props.newAdmin || this.props.sitesettings || this.props.twilioConfig) && (
            <li className={this.isPathActive('/admin') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
              <div className={this.state.adminMenu ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('adminMenu')} data-toggle="collapse">
                <span className="menu-icon" style={{ marginRight: '0.75rem' }}>
                  <i className="mdi mdi-account-star" style={{ fontSize: '1.1rem' }}></i>
                </span>
                <span className="menu-title" style={{ fontWeight: '500' }}>
                  <Trans>Admin Manager</Trans>
                </span>
                <i className="menu-arrow" style={{ 
                  marginLeft: 'auto',
                  transition: 'transform 0.3s ease',
                  transform: this.state.adminMenu ? 'rotate(180deg)' : 'rotate(0deg)'
                }}></i>
              </div>
              <Collapse in={this.state.adminMenu}>
                <div>
                  <ul className="nav flex-column sub-menu">
                    {this.props.allAdmins && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/admin/alladmins') ? 'nav-link active' : 'nav-link'} to="/admin/alladmins" style={{
                          color: this.isPathActive('/admin/alladmins') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/admin/alladmins') ? '600' : '400'
                        }}>
                          <Trans>All Admins</Trans>
                        </Link>
                      </li>
                    )}
                    {this.props.newAdmin && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/admin/addadmin') ? 'nav-link active' : 'nav-link'} to="/admin/addadmin" style={{
                          color: this.isPathActive('/admin/addadmin') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/admin/addadmin') ? '600' : '400'
                        }}>
                          <Trans>Add New Admin</Trans>
                        </Link>
                      </li>
                    )}
                    {this.props.sitesettings && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/admin/sitesettings') ? 'nav-link active' : 'nav-link'} to="/admin/sitesettings" style={{
                          color: this.isPathActive('/admin/sitesettings') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/admin/sitesettings') ? '600' : '400'
                        }}>
                          <Trans>Website Settings</Trans>
                        </Link>
                      </li>
                    )}
                    {this.props.twilioConfig && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/admin/twilio-config') ? 'nav-link active' : 'nav-link'} to="/admin/twilio-config" style={{
                          color: this.isPathActive('/admin/twilio-config') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/admin/twilio-config') ? '600' : '400'
                        }}>
                          <Trans>Twilio SMS Config</Trans>
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </Collapse>
            </li>
          )}

          {/* {(this.props.allAdmins || this.props.newAdmin) && (
            <li className={this.isPathActive('/agent') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
              <div className={this.state.agentMenu ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('agentMenu')} data-toggle="collapse" style={{
                color: this.isPathActive('/agent') ? 'white' : '#cbd5e1',
                borderRadius: '8px',
                margin: '0 0.5rem',
                padding: '0.75rem 1rem',
                transition: 'all 0.3s ease',
                background: this.isPathActive('/agent') ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                boxShadow: this.isPathActive('/agent') ? '0 4px 6px rgba(99, 102, 241, 0.3)' : 'none',
                cursor: 'pointer'
              }}>
                <span className="menu-icon" style={{ marginRight: '0.75rem' }}>
                  <i className="mdi mdi-account-star" style={{ fontSize: '1.1rem' }}></i>
                </span>
                <span className="menu-title" style={{ fontWeight: '500' }}>
                  <Trans>Agent Manager</Trans>
                </span>
                <i className="menu-arrow" style={{ 
                  marginLeft: 'auto',
                  transition: 'transform 0.3s ease',
                  transform: this.state.agentMenu ? 'rotate(180deg)' : 'rotate(0deg)'
                }}></i>
              </div>
              <Collapse in={this.state.agentMenu}>
                <div>
                  <ul className="nav flex-column sub-menu" style={{ 
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: '8px',
                    margin: '0 0.5rem',
                    padding: '0.5rem 0'
                  }}>
                    {this.props.allAdmins && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/agent/allagents') ? 'nav-link active' : 'nav-link'} to="/agent/allagents" style={{
                          color: this.isPathActive('/agent/allagents') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/agent/allagents') ? '600' : '400'
                        }}>
                          <Trans>All Agents</Trans>
                        </Link>
                      </li>
                    )}
                    {this.props.newAdmin && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/agent/addagent') ? 'nav-link active' : 'nav-link'} to="/agent/addagent" style={{
                          color: this.isPathActive('/agent/addagent') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/agent/addagent') ? '600' : '400'
                        }}>
                          <Trans>Add New Agent</Trans>
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </Collapse>
            </li>
          )} */}
          {(this.props.allUsers || this.props.newUser || this.props.pendingKyc || this.props.completedKyc || this.props.rejectKyc) && (
            <li className={this.isPathActive('/user') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
              <div className={this.state.userMenu ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('userMenu')} data-toggle="collapse">
                <span className="menu-icon" style={{ marginRight: '0.75rem' }}>
                  <i className="mdi mdi-face" style={{ fontSize: '1.1rem' }}></i>
                </span>
                <span className="menu-title" style={{ fontWeight: '500' }}>
                  <Trans>User Manager</Trans>
                </span>
                <i className="menu-arrow" style={{ 
                  marginLeft: 'auto',
                  transition: 'transform 0.3s ease',
                  transform: this.state.userMenu ? 'rotate(180deg)' : 'rotate(0deg)'
                }}></i>
              </div>
              <Collapse in={this.state.userMenu}>
                <div>
                  <ul className="nav flex-column sub-menu" style={{ 
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: '8px',
                    margin: '0 0.5rem',
                    padding: '0.5rem 0'
                  }}>
                    {this.props.allUsers && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/user/allusers') ? 'nav-link active' : 'nav-link'} to="/user/allusers" style={{
                          color: this.isPathActive('/user/allusers') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/user/allusers') ? '600' : '400'
                        }}>
                          <Trans>View All Users</Trans>
                        </Link>
                      </li>
                    )}
                    {this.props.newUser && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/user/adduser') ? 'nav-link active' : 'nav-link'} to="/user/adduser" style={{
                          color: this.isPathActive('/user/adduser') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/user/adduser') ? '600' : '400'
                        }}>
                          <Trans>Add New User</Trans>
                        </Link>
                      </li>
                    )}
                    {this.props.pendingKyc && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/user/UserKyc') ? 'nav-link active' : 'nav-link'} to="/user/UserKyc" style={{
                          color: this.isPathActive('/user/UserKyc') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/user/UserKyc') ? '600' : '400'
                        }}>
                          <Trans>Pending Kyc</Trans>
                        </Link>
                      </li>
                    )}
                    {this.props.completedKyc && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/user/kyc') ? 'nav-link active' : 'nav-link'} to="/user/kyc" style={{
                          color: this.isPathActive('/user/kyc') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/user/kyc') ? '600' : '400'
                        }}>
                          <Trans>Completed Kyc</Trans>
                        </Link>
                      </li>
                    )}
                    {this.props.rejectKyc && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/user/reject') ? 'nav-link active' : 'nav-link'} to="/user/reject" style={{
                          color: this.isPathActive('/user/reject') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/user/reject') ? '600' : '400'
                        }}>
                          <Trans>Reject Kyc</Trans>
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </Collapse>
            </li>
          )}
          {(this.props.allChallenges || this.props.completedChallenges || this.props.conflictChallenges || this.props.cancelledChallenges || this.props.runningChallenges || this.props.newChallenge || this.props.dropChallenge) && (
            <li className={this.isPathActive('/challenge') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
              <div className={this.state.challengeMenu ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('challengeMenu')} data-toggle="collapse">
                <span className="menu-icon" style={{ marginRight: '0.75rem' }}>
                  <i className="mdi mdi-xbox-controller" style={{ fontSize: '1.1rem' }}></i>
                </span>
                <span className="menu-title" style={{ fontWeight: '500' }}>
                  <Trans>Challenge Manager</Trans>
                </span>
                <i className="menu-arrow" style={{ 
                  marginLeft: 'auto',
                  transition: 'transform 0.3s ease',
                  transform: this.state.challengeMenu ? 'rotate(180deg)' : 'rotate(0deg)'
                }}></i>
              </div>
              <Collapse in={this.state.challengeMenu}>
                <div>
                  <ul className="nav flex-column sub-menu" style={{ 
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: '8px',
                    margin: '0 0.5rem',
                    padding: '0.5rem 0'
                  }}>
                    {this.props.allChallenges && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/challenge/allchallenges') ? 'nav-link active' : 'nav-link'} to="/challenge/allchallenges" style={{
                          color: this.isPathActive('/challenge/allchallenges') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/challenge/allchallenges') ? '600' : '400'
                        }}>
                          <Trans>View All Challenge</Trans>
                        </Link>
                      </li>
                    )}
                    {this.props.completedChallenges && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/challenge/completed_challange') ? 'nav-link active' : 'nav-link'} to="/challenge/completed_challange" style={{
                          color: this.isPathActive('/challenge/completed_challange') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/challenge/completed_challange') ? '600' : '400'
                        }}>
                          <Trans>Completed Challenge</Trans>
                        </Link>
                      </li>
                    )}
                    {this.props.conflictChallenges && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/challenge/conflict_challange') ? 'nav-link active' : 'nav-link'} to="/challenge/conflict_challange" style={{
                          color: this.isPathActive('/challenge/conflict_challange') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/challenge/conflict_challange') ? '600' : '400'
                        }}>
                          <Trans>Conflict Challenge</Trans>
                        </Link>
                      </li>
                    )}
                    {this.props.cancelledChallenges && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/challenge/cancelled_challange') ? 'nav-link active' : 'nav-link'} to="/challenge/cancelled_challange" style={{
                          color: this.isPathActive('/challenge/cancelled_challange') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/challenge/cancelled_challange') ? '600' : '400'
                        }}>
                          <Trans>Cancelled Challenge</Trans>
                        </Link>
                      </li>
                    )}
                    {this.props.runningChallenges && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/challenge/running_challange') ? 'nav-link active' : 'nav-link'} to="/challenge/running_challange" style={{
                          color: this.isPathActive('/challenge/running_challange') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/challenge/running_challange') ? '600' : '400'
                        }}>
                          <Trans>Running Challenge</Trans>
                        </Link>
                      </li>
                    )}

                    {this.props.dropChallenges && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/challenge/drop_challange') ? 'nav-link active' : 'nav-link'} to="/challenge/drop_challange" style={{
                          color: this.isPathActive('/challenge/drop_challange') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/challenge/drop_challange') ? '600' : '400'
                        }}>
                          <Trans>Drop Challenge</Trans>
                        </Link>
                      </li>
                    )}

                    {this.props.newChallenge && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/challenge/new_challange') ? 'nav-link active' : 'nav-link'} to="/challenge/new_challange" style={{
                          color: this.isPathActive('/challenge/new_challange') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/challenge/new_challange') ? '600' : '400'
                        }}>
                          <Trans>New Challenge</Trans>
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </Collapse>
            </li>
          )}
          {(this.props.penaltyBonus || this.props.depositHistory || this.props.withdrawlHistory || this.props.allWithdrawlRequests || this.props.allDepositRequests) && (
            <li className={this.isPathActive('/transaction') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
              <div className={this.state.transactionMenu ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('transactionMenu')} data-toggle="collapse">
                <span className="menu-icon" style={{ marginRight: '0.75rem' }}>
                  <i className="mdi mdi-transit-transfer" style={{ fontSize: '1.1rem' }}></i>
                </span>
                <span className="menu-title" style={{ fontWeight: '500' }}>
                  <Trans>Transaction Manager</Trans>
                </span>
                <i className="menu-arrow" style={{ 
                  marginLeft: 'auto',
                  transition: 'transform 0.3s ease',
                  transform: this.state.transactionMenu ? 'rotate(180deg)' : 'rotate(0deg)'
                }}></i>
              </div>
              <Collapse in={this.state.transactionMenu}>
                <div>
                  <ul className="nav flex-column sub-menu" style={{ 
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: '8px',
                    margin: '0 0.5rem',
                    padding: '0.5rem 0'
                  }}>
                    {this.props.penaltyBonus && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/transaction/penaltybonus') ? 'nav-link active' : 'nav-link'} to="/transaction/penaltybonus" style={{
                          color: this.isPathActive('/transaction/penaltybonus') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/transaction/penaltybonus') ? '600' : '400'
                        }}>
                          <Trans>Penalty & Bonus</Trans>
                        </Link>
                      </li>
                    )}
                    {this.props.depositHistory && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/transaction/transaction_history') ? 'nav-link active' : 'nav-link'} to="/transaction/transaction_history" style={{
                          color: this.isPathActive('/transaction/transaction_history') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/transaction/transaction_history') ? '600' : '400'
                        }}>
                          <Trans>Deposit history</Trans>
                        </Link>
                      </li>
                    )}
                    {this.props.bonusHistory && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/transaction/bonus_history') ? 'nav-link active' : 'nav-link'} to="/transaction/bonus_history" style={{
                          color: this.isPathActive('/transaction/bonus_history') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/transaction/bonus_history') ? '600' : '400'
                        }}>
                          <Trans>Bonus history</Trans>
                        </Link>
                      </li>
                    )}
                    {this.props.withdrawlHistory && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/transaction/withdraw') ? 'nav-link active' : 'nav-link'} to="/transaction/withdraw" style={{
                          color: this.isPathActive('/transaction/withdraw') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/transaction/withdraw') ? '600' : '400'
                        }}>
                          <Trans>Withdrawl history</Trans>
                        </Link>
                      </li>
                    )}
                    {this.props.allWithdrawlRequests && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/transaction/allwithdrawl') ? 'nav-link active' : 'nav-link'} to="/transaction/allwithdrawl" style={{
                          color: this.isPathActive('/transaction/allwithdrawl') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/transaction/allwithdrawl') ? '600' : '400'
                        }}>
                          <Trans>View All Withdrawl Request</Trans>
                        </Link>
                      </li>
                    )}
                    {this.props.allDepositRequests && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/transaction/alldeposits') ? 'nav-link active' : 'nav-link'} to="/transaction/alldeposits" style={{
                          color: this.isPathActive('/transaction/alldeposits') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/transaction/alldeposits') ? '600' : '400'
                        }}>
                          <Trans>View All Deposit Request</Trans>
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </Collapse>
            </li>
          )}
          {(this.props.bonusReport || this.props.depositReport || this.props.penaltyReport || this.props.withdrawlReport) && (
            <li className={this.isPathActive('/reports') ? 'nav-item menu-items active' : 'nav-item menu-items'}>
              <div className={this.state.reportsMenu ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => this.toggleMenuState('reportsMenu')} data-toggle="collapse">
                <span className="menu-icon" style={{ marginRight: '0.75rem' }}>
                  <i className="mdi mdi-poll-box" style={{ fontSize: '1.1rem' }}></i>
                </span>
                <span className="menu-title" style={{ fontWeight: '500' }}>
                  <Trans>Reports</Trans>
                </span>
                <i className="menu-arrow" style={{ 
                  marginLeft: 'auto',
                  transition: 'transform 0.3s ease',
                  transform: this.state.reportsMenu ? 'rotate(180deg)' : 'rotate(0deg)'
                }}></i>
              </div>
              <Collapse in={this.state.reportsMenu}>
                <div>
                  <ul className="nav flex-column sub-menu" style={{ 
                    background: 'rgba(15, 23, 42, 0.5)',
                    borderRadius: '8px',
                    margin: '0 0.5rem',
                    padding: '0.5rem 0'
                  }}>
                    {this.props.bonusReport && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/Reports/bonus_report') ? 'nav-link active' : 'nav-link'} to="/Reports/bonusReport" style={{
                          color: this.isPathActive('/Reports/bonus_report') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/Reports/bonus_report') ? '600' : '400'
                        }}>
                          <Trans>bonus Report</Trans>
                        </Link>
                      </li>
                    )}
                    {this.props.depositReport && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/Reports/deposit_report') ? 'nav-link active' : 'nav-link'} to="/Reports/depositReport" style={{
                          color: this.isPathActive('/Reports/deposit_report') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/Reports/deposit_report') ? '600' : '400'
                        }}>
                          <Trans>deposit Report</Trans>
                        </Link>
                      </li>
                    )}
                    {this.props.penaltyReport && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/Reports/penalty_report') ? 'nav-link active' : 'nav-link'} to="/Reports/penaltyReport" style={{
                          color: this.isPathActive('/Reports/penalty_report') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/Reports/penalty_report') ? '600' : '400'
                        }}>
                          <Trans>penalty Report</Trans>
                        </Link>
                      </li>
                    )}
                    {this.props.withdrawalReport && (
                      <li className="nav-item"> 
                        <Link className={this.isPathActive('/Reports/withdrawal_report') ? 'nav-link active' : 'nav-link'} to="/Reports/withdrawalReport" style={{
                          color: this.isPathActive('/Reports/withdrawal_report') ? '#6366f1' : '#cbd5e1',
                          padding: '0.5rem 1.5rem',
                          fontSize: '0.875rem',
                          fontWeight: this.isPathActive('/Reports/withdrawal_report') ? '600' : '400'
                        }}>
                          <Trans>withdrawal Report</Trans>
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              </Collapse>
            </li>
          )}
        </ul>
      </nav>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }

  componentDidMount() {
    this.onRouteChanged();
    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector('body');
    document.querySelectorAll('.sidebar .nav-item').forEach((el) => {

      el.addEventListener('mouseover', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
  }

}

export default withRouter(Sidebar);