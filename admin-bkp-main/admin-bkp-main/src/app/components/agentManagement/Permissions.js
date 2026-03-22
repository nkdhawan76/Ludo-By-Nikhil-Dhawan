import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import axios from 'axios'


function Permissions() {
    let { id } = useParams();
    const [user, setUser] = useState();
    const [set, setSet] = useState();
    const access_token = localStorage.getItem("token")
    const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
    const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
    const nodeMode = process.env.NODE_ENV;
    if (nodeMode === "development") {
      var baseUrl = beckendLocalApiUrl;
    } else {
      baseUrl = beckendLiveApiUrl;
    }

    const headers = {
        Authorization: `Bearer ${access_token}`
    }
    const getUser = () => {
        axios.get(baseUrl+`get_user/${id}`, { headers })
            .then((res) => {
                if (res.data.Permissions) {
                    if (res.data.Permissions.length) {
                        setSet(true);
                    }
                }
                setUser(res.data)
            }).catch((e) => {
                if (e.response.status == 401) {
                    localStorage.removeItem('token');
                }
            })
    }
    const grantAccess = () => {
        try {
            axios.patch(baseUrl+`agent/permission/${id}`, { headers })
                .then((res) => {
                    getUser();
                }).catch((e) => {
                    if (e.response.status == 401) {
                        localStorage.removeItem('token');
                    }
                })
        } catch (error) {
            console.log(error)
        }
    }
    const giveAccess = (Status,ID) => {
        try {
            axios.post(baseUrl+`agent/permission/nested/${ID}`,{
                Status
            }, { headers }) 
                .then((res) => {
                    getUser();
                }).catch((e) => {
                    if (e.response.status == 401) {
                        localStorage.removeItem('token');
                    }
                })
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getUser();
    }, [])

    return (
        <div className="row justify-content-center">
            <div className="col-12 grid-margin">
                {user && (
                    <div className="card" style={{
                        background: '#1e293b',
                        borderRadius: '16px',
                        border: '1px solid #334155',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                        color: '#f8fafc'
                    }}>
                        {!Boolean(set) && (
                            <div className="card-body text-center">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-lg"
                                    onClick={grantAccess}
                                >
                                    Grant Permissions
                                </button>
                            </div>
                        )}
                        {Boolean(set) && (
                            <div className='card-body'>
                                <h4 className="card-title" style={{
                                    fontWeight: '600',
                                    fontSize: '1.5rem',
                                    marginBottom: '2rem',
                                    borderBottom: '1px solid #334155',
                                    paddingBottom: '1rem'
                                }}>
                                    <i className="mdi mdi-security" style={{ marginRight: '0.75rem', color: '#6366f1' }}></i>
                                    Pages Permission for {user.Name}
                                </h4>
                                <ul className="list-group list-group-flush">
                                    {user.Permissions.map((item, key) =>
                                        <li key={key} className="list-group-item" style={{
                                            background: 'transparent',
                                            border: 'none',
                                            padding: '1rem 0.5rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            borderBottom: '1px solid #334155'
                                        }}>
                                            <div style={{
                                                fontWeight: '500',
                                                fontSize: '1rem',
                                                textTransform: 'capitalize'
                                            }}>
                                                {item.Permission.replace(/([A-Z])/g, ' $1').trim()}
                                            </div>
                                            <div>
                                                <div className="custom-control custom-switch">
                                                    <input
                                                        type="checkbox"
                                                        checked={item.Status}
                                                        onChange={(e) => giveAccess(!item.Status, item._id)}
                                                        className="custom-control-input"
                                                        id={item.Permission}
                                                    />
                                                    <label className="custom-control-label" htmlFor={item.Permission}>
                                                        {item.Status ? 'Allowed' : 'Denied'}
                                                    </label>
                                                </div>
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Permissions