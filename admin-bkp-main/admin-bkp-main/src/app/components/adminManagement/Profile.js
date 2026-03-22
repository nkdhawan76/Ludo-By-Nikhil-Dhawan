import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

export default function Profile() {

    const history = useHistory()

    const [Name, setName] = useState()
    const [Phone, setPhone] = useState()
    // const [user, setProfile] = useState()
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




        const data = await axios.patch(baseUrl+"user/edit", {
            Name,
            Phone
        },
            { headers }).then((res) => {

                history.push("/dashboard")
            })

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
                                <i className="mdi mdi-account-circle" style={{ marginRight: '0.75rem', color: '#6366f1' }}></i>
                                Update Admin Profile
                            </h4>

                            <form id="add_admin_form" onSubmit={(e) => addAdmin(e)}>
                                <div className="form-group row">
                                    <label htmlFor="name" className="col-sm-3 col-form-label" style={{ fontWeight: '500' }}>Name</label>
                                    <div className="col-sm-9">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            placeholder="Enter new name"
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            value={Name || ''}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row mt-4">
                                    <label htmlFor="Phone" className="col-sm-3 col-form-label" style={{ fontWeight: '500' }}>Mobile</label>
                                    <div className="col-sm-9">
                                        <input
                                            type="tel"
                                            className="form-control"
                                            id="Phone"
                                            placeholder="Enter new mobile number"
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                            value={Phone || ''}
                                        />
                                    </div>
                                </div>
                                <div className="mt-5 text-right">
                                    <button type="submit" className='btn btn-primary'>Update Profile</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}