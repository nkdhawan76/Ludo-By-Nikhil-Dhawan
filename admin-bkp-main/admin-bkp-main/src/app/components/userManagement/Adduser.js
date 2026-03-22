import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

export default function Adduser() {
    const history = useHistory()
    const { id } = useParams()

    const [Name, setName] = useState('')
    const [Phone, setPhone] = useState('')
    const [Email, setEmail] = useState('')
    const [Password, setPassword] = useState('')
    const [cPassword, setCPassword] = useState('')
    const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
    const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
    const nodeMode = process.env.NODE_ENV;
    const baseUrl = nodeMode === "development" ? beckendLocalApiUrl : beckendLiveApiUrl;

    useEffect(() => {
        if (id) {
            const access_token = localStorage.getItem("token")
            const headers = { Authorization: `Bearer ${access_token}` }
            axios.get(baseUrl + `get_user/${id}`, { headers })
                .then((res) => {
                    setName(res.data.Name)
                    setPhone(res.data.Phone)
                    setEmail(res.data.Email)
                })
                .catch((e) => console.log(e))
        }
    }, [id, baseUrl])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const access_token = localStorage.getItem("token")
        const headers = { Authorization: `Bearer ${access_token}` }

        if (id) {
            // Update user
            axios.patch(baseUrl + `admin/edit/user/${id}`, { Name, Phone, Email }, { headers })
                .then(() => {
                    history.push("/user/allusers")
                })
                .catch((e) => alert(e))
        } else {
            // Add new user
            if (Password === cPassword) {
                axios.post(baseUrl + `register`, { Name, Phone, Email, Password, cPassword }, { headers })
                    .then(() => {
                        history.push("/user/allusers")
                    })
                    .catch((e) => alert(e))
            } else {
                alert("Passwords do not match!")
            }
        }
    }

    return (
        <div>
            <h4 className='font-weight-bold my-3'>{id ? 'UPDATE USER' : 'ADD NEW USER'}</h4>
            <div className="card text-white" style={{ backgroundColor: "rgba(0, 27, 11, 0.734)" }}>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="name">Name</label>
                                <input type="text" className="form-control" id="name" value={Name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="mobile">Mobile</label>
                                <input type="text" className="form-control" id="mobile" value={Phone} onChange={(e) => setPhone(e.target.value)} maxLength={10} placeholder="Mobile" required />
                            </div>
                            <div className="form-group col-md-4">
                                <label htmlFor="email">Email</label>
                                <input type="email" className="form-control" id="email" value={Email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                            </div>
                        </div>
                        {!id && (
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" className="form-control" id="password" value={Password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="confirm_password">Confirm Password</label>
                                    <input type="password" className="form-control" id="confirm_password" value={cPassword} onChange={(e) => setCPassword(e.target.value)} placeholder="Confirm Password" required />
                                </div>
                            </div>
                        )}
                        <button type="submit" className="btn btn-success float-right">{id ? 'Update User' : 'Add User'}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

