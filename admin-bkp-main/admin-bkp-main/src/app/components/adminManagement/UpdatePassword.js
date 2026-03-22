import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

export default function UpdatePassword() {

    const history = useHistory()

    const [Password, setPassword] = useState()
    const [newPassword, setNewPassword] = useState()
    const [confirmNewPassword, setCPassword] = useState()
    const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
    const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
    const nodeMode = process.env.NODE_ENV;
    if (nodeMode === "development") {
      var baseUrl = beckendLocalApiUrl;
    } else {
      baseUrl = beckendLiveApiUrl;
    }



    const addAdmin = async (e) => {

        e.preventDefault();

        const access_token = localStorage.getItem("token")

        const headers = {
            Authorization: `Bearer ${access_token}`
        }

        if (newPassword !== confirmNewPassword) {
            alert("Passwords don't match");
        } else {
            const data = await axios.post(baseUrl+"changepassword", {
                Password,
                newPassword,
                confirmNewPassword,
            },
                { headers }).then((res) => {

                    history.push("/admin/alladmins")
                })
        }
    }

    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                <div className="col-md-8 grid-margin">
                    <div className="card" style={{
                        background: '#1e293b',
                        borderRadius: '16px',
                        border: '1px solid #334155',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        color: '#f8fafc'
                    }}>
                        <div className="card-body">
                            <h4 className="card-title" style={{
                                fontWeight: '600',
                                fontSize: '1.5rem',
                                marginBottom: '2rem',
                                borderBottom: '1px solid #334155',
                                paddingBottom: '1rem'
                            }}>
                                <i className="mdi mdi-lock-reset" style={{ marginRight: '0.75rem', color: '#6366f1' }}></i>
                                Update Admin Password
                            </h4>

                            <form id="add_admin_form" onSubmit={(e) => addAdmin(e)}>
                                <div className="form-group row">
                                    <label htmlFor="password" className="col-sm-3 col-form-label" style={{ fontWeight: '500' }}>Current Password</label>
                                    <div className="col-sm-9">
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            placeholder="Enter current password"
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group row mt-4">
                                    <label htmlFor="newPassword" className="col-sm-3 col-form-label" style={{ fontWeight: '500' }}>New Password</label>
                                    <div className="col-sm-9">
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="newPassword"
                                            placeholder="Enter new password"
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group row mt-4">
                                    <label htmlFor="confirmNewPassword" className="col-sm-3 col-form-label" style={{ fontWeight: '500' }}>Confirm New Password</label>
                                    <div className="col-sm-9">
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="confirmNewPassword"
                                            placeholder="Confirm new password"
                                            onChange={(e) => setCPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mt-5 text-right">
                                    <button type="submit" className='btn btn-primary'>Update Password</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
