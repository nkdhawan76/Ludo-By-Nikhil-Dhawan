import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, Link, useParams } from 'react-router-dom';
import { Tab, Nav } from 'react-bootstrap';
import '../transaction/imageview.css';

const $ = require("jquery");
$.Datatable = require("datatables.net");

export default function View() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [challenge, setChallenge] = useState([]);
    const [txn, setTxn] = useState([]);
    const [txnwith, setTxnwith] = useState([]);
    const [referral, setReferral] = useState([]);
    const [kyc, setKyc] = useState(null);
    const [referCount, setReferCount] = useState([]);
    const [mismatchValue, setMismatchValue] = useState(0);
    const [holdBalance, setHoldBalance] = useState(0);
    const [activeTab, setActiveTab] = useState('challenges');

    const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
    const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
    const nodeMode = process.env.NODE_ENV;
    const baseUrl = nodeMode === "development" ? beckendLocalApiUrl : beckendLiveApiUrl;

    useEffect(() => {
        const access_token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${access_token}` };

        axios.get(baseUrl + `get_user/${id}`, { headers })
            .then((res) => {
                const userData = res.data;
                setUser(userData);
                setMismatchValue(userData.Wallet_balance - (((userData.wonAmount - userData.loseAmount) + userData.totalDeposit + userData.referral_earning + userData.totalBonus) - (userData.totalWithdrawl + userData.referral_wallet + userData.withdraw_holdbalance + userData.hold_balance + userData.totalPenalty)));
                setHoldBalance(userData.hold_balance);
                if (userData.referral_code) {
                    Allrefer(userData.referral_code);
                }
            })
            .catch((e) => console.log(e));
    }, [id, baseUrl]);

    useEffect(() => {
        if ($.fn.DataTable.isDataTable('table')) {
            $('table').DataTable().destroy();
        }
        $('table').DataTable();
    }, [challenge, txn, txnwith, referral, kyc]);


    const Allrefer = async (referralCode) => {
        const access_token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${access_token}` };
        try {
            const res = await axios.get(baseUrl + `referral/code/${referralCode}`, { headers });
            setReferCount(res.data);
        } catch (e) {
            console.log(e);
        }
    };

    const fetchData = async (type) => {
        const access_token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${access_token}` };
        let url = '';
        let setData;

        switch (type) {
            case 'challenges':
                url = baseUrl + `get_challange/user/${id}`;
                setData = setChallenge;
                break;
            case 'transactions':
                url = baseUrl + `txn_history/user/${id}`;
                setData = setTxn;
                break;

            case 'withdrawals':
                url = baseUrl + `txnwith_history/user/${id}`;
                setData = setTxnwith;
                break;
            case 'referrals':
                if (user && user.referral_code) {
                    url = baseUrl + `referral/code/winn/${user.referral_code}`;
                    setData = setReferral;
                }
                break;
            case 'kyc':
                url = baseUrl + `admin/user/kyc/${id}`;
                setData = setKyc;
                break;
            default:
                return;
        }
        if (!url) return;

        try {
            const res = await axios.get(url, { headers });
            setChallenge([]);
            setTxn([]);
            setTxnwith([]);
            setReferral([]);
            setKyc(null);
            setData(res.data);
            setActiveTab(type);
        } catch (e) {
            console.log(e);
        }
    };
    const dateFormat = (e) => {
        const date = new Date(e);
        return date.toLocaleString('default', { month: 'long', day: 'numeric', hour: 'numeric', hour12: true, minute: 'numeric' });
    };

    const updateKycStatus = (Id, type) => {
        const access_token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${access_token}` };
        axios.patch(baseUrl + `${type}/${Id}`, { verified: "verified" }, { headers })
            .then(() => fetchData('kyc'))
            .catch(e => console.log(e));
    };

    const updateBalance = (action) => {
        const access_token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${access_token}` };
        axios.patch(baseUrl + `user/${action}/clear/${id}`, {}, { headers })
            .then(() => {
                axios.get(baseUrl + `get_user/${id}`, { headers })
                    .then((res) => {
                        const userData = res.data;
                        setUser(userData);
                        setMismatchValue(userData.Wallet_balance - (((userData.wonAmount - userData.loseAmount) + userData.totalDeposit + userData.referral_earning + userData.totalBonus) - (userData.totalWithdrawl + userData.referral_wallet + userData.withdraw_holdbalance + userData.hold_balance + userData.totalPenalty)));
                        setHoldBalance(userData.hold_balance);
                    });
            })
            .catch(e => console.log(e));
    };

    if (!user) {
        return <div className="text-center mt-5"><h4>Loading...</h4></div>;
    }

    const renderTable = () => {
        let headers = [];
        let data = [];

        switch (activeTab) {
            case 'challenges':
                headers = ["#", "Game Type", "Game ID", "Amount", "Status", "Date"];
                data = challenge;
                break;
            case 'transactions':
                headers = ["#", "Txn ID", "Amount", "Type", "Status", "Date"];
                data = txn;
                break;
            case 'withdrawals':
                headers = ["#", "Txn ID", "Amount", "Status", "Date"];
                data = txnwith;
                break;
            case 'referrals':
                headers = ["#", "User ID", "Amount", "Date"];
                data = referral;
                break;
            case 'kyc':
                return renderKycTable();
            default:
                return null;
        }

        return (
            <div className="table-responsive">
                <table className="table table-dark table-striped">
                    <thead>
                        <tr>
                            {headers.map(h => <th key={h}>{h}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data && data.map((item, index) => (
                            <tr key={item._id || index}>
                                <td>{index + 1}</td>
                                {activeTab === 'challenges' && <><td>{item.Game_type}</td><td>{item.Challange_id}</td><td>{item.Game_Ammount}</td><td><div className={`badge ${item.Status === 'completed' ? 'badge-success' : 'badge-danger'}`}>{item.Status}</div></td><td>{dateFormat(item.createdAt)}</td></>}
                                {activeTab === 'transactions' && <><td>{item.Tx_refrance}</td><td>{item.amount}</td><td>{item.type}</td><td><div className={`badge ${item.status === 'success' ? 'badge-success' : 'badge-danger'}`}>{item.status}</div></td><td>{dateFormat(item.createdAt)}</td></>}
                                {activeTab === 'withdrawals' && <><td>{item.txn_id}</td><td>{item.amount}</td><td><div className={`badge ${item.status === 'success' ? 'badge-success' : 'badge-danger'}`}>{item.status}</div></td><td>{dateFormat(item.createdAt)}</td></>}
                                {activeTab === 'referrals' && <><td>{item.referred_by}</td><td>{item.amount}</td><td>{dateFormat(item.createdAt)}</td></>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderKycTable = () => {
        if (!kyc) return null;
        return (
            <div className="table-responsive">
                <table className="table table-dark table-striped">
                    <thead>
                        <tr><th>Document</th><th>Details</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {kyc.Aadhar &&
                            <tr>
                                <td>Aadhar Card</td>
                                <td>
                                    <p><strong>Number:</strong> {kyc.Aadhar.aadhar_card_number}</p>
                                    <div className="d-flex">
                                        <div className="img-panel mr-2"><img className="img" src={`${baseUrl}images/kyc/${kyc.Aadhar.aadhar_card_image}`} alt="Aadhar" width="100" /></div>
                                        <div className="img-panel"><img className="img" src={`${baseUrl}images/kyc/${kyc.Aadhar.aadhar_card_image_back}`} alt="Aadhar Back" width="100" /></div>
                                    </div>
                                </td>
                                <td>
                                    {kyc.Aadhar.verified !== 'verified' ?
                                        <button className="btn btn-success" onClick={() => updateKycStatus(kyc.Aadhar._id, 'aadharcard')}>Verify</button> :
                                        <span className="badge badge-success">Verified</span>
                                    }
                                </td>
                            </tr>
                        }
                        {kyc.Pan &&
                            <tr>
                                <td>PAN Card</td>
                                <td>
                                    <p><strong>Number:</strong> {kyc.Pan.pan_card_number}</p>
                                    <div className="img-panel"><img className="img" src={`${baseUrl}images/kyc/${kyc.Pan.pan_card_image}`} alt="PAN" width="100" /></div>
                                </td>
                                <td>
                                    {kyc.Pan.verified !== 'verified' ?
                                        <button className="btn btn-success" onClick={() => updateKycStatus(kyc.Pan._id, 'pancard')}>Verify</button> :
                                        <span className="badge badge-success">Verified</span>
                                    }
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
                <div className="img-out"></div>
            </div>
        );
    };

    return (
        <div className="container-fluid">
            <h4 className='font-weight-bold my-3'>User Details</h4>
            <div className="row">
                <div className="col-md-12">
                    <div className="card text-white" style={{ backgroundColor: "rgba(0, 27, 11, 0.734)" }}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-2 text-center">
                                    <img src={user.Profile_pic || 'https://via.placeholder.com/150'} alt="profile" className="img-lg rounded-circle mb-3" />
                                    <h4 className="card-title">{user.Name}</h4>
                                    <p className="text-muted">{user.user_type}</p>
                                </div>
                                <div className="col-md-10">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <p><strong>User ID:</strong> {user._id}</p>
                                            <p><strong>Phone:</strong> {user.Phone}</p>
                                            <p><strong>Email:</strong> {user.Email || 'N/A'}</p>
                                        </div>
                                        <div className="col-md-4">
                                            <p><strong>Wallet Balance:</strong> <span className="text-success">₹{user.Wallet_balance}</span></p>
                                            <p><strong>Hold Balance:</strong> <span className="text-warning">₹{holdBalance}</span></p>
                                            <p><strong>Mismatch Balance:</strong> <span className="text-danger">₹{mismatchValue}</span></p>
                                        </div>
                                        <div className="col-md-4">
                                            <p><strong>Verified:</strong> {user.verified ? <span className="badge badge-success">Yes</span> : <span className="badge badge-danger">No</span>}</p>
                                            <p><strong>Referred By:</strong> {user.referral || 'N/A'}</p>
                                            <p><strong>Total Referrals:</strong> {referCount.length}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <Link to={`/user/adduser/${user._id}`} className="btn btn-primary mr-2">Edit User</Link>
                                        <button className="btn btn-warning mr-2" onClick={() => updateBalance('missmatch')}>Clear Mismatch</button>
                                        <button className="btn btn-info" onClick={() => updateBalance('Hold')}>Clear Hold</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-md-12">
                    <div className="card text-white" style={{ backgroundColor: "rgba(0, 27, 11, 0.734)" }}>
                        <div className="card-body">
                            <Tab.Container id="user-details-tabs" defaultActiveKey="challenges" onSelect={(k) => fetchData(k)}>
                                <Nav variant="tabs" className="mb-3">
                                    <Nav.Item><Nav.Link eventKey="challenges">Challenges</Nav.Link></Nav.Item>
                                    <Nav.Item><Nav.Link eventKey="transactions">Transactions</Nav.Link></Nav.Item>
                                    <Nav.Item><Nav.Link eventKey="withdrawals">Withdrawals</Nav.Link></Nav.Item>
                                    <Nav.Item><Nav.Link eventKey="referrals">Referrals</Nav.Link></Nav.Item>
                                    <Nav.Item><Nav.Link eventKey="kyc">KYC Details</Nav.Link></Nav.Item>
                                </Nav>
                                <Tab.Content>
                                    <Tab.Pane eventKey="challenges">{activeTab === 'challenges' && renderTable()}</Tab.Pane>
                                    <Tab.Pane eventKey="transactions">{activeTab === 'transactions' && renderTable()}</Tab.Pane>
                                    <Tab.Pane eventKey="withdrawals">{activeTab === 'withdrawals' && renderTable()}</Tab.Pane>
                                    <Tab.Pane eventKey="referrals">{activeTab === 'referrals' && renderTable()}</Tab.Pane>
                                    <Tab.Pane eventKey="kyc">{activeTab === 'kyc' && renderTable()}</Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
