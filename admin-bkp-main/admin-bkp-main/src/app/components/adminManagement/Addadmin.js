import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

export default function Addadmin() {

    const history = useHistory()
    const [Name, setName] = useState()
    const [Phone, setPhone] = useState()
    const [Password, setPassword] = useState()
    const [cPassword, setCPassword] = useState()
    const [type, setType] = useState("Admin")
    const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
    const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
    const nodeMode = process.env.NODE_ENV;
    if (nodeMode === "development") {
        var baseUrl = beckendLocalApiUrl;
    } else {
        baseUrl = beckendLiveApiUrl;
    }
    const [errors, setErrors] = useState({});

    const validate = () => {
        let tempErrors = {};
        if (!Name || Name.trim() === "") tempErrors.Name = "Name is required";
        if (!Phone || Phone.trim() === "") tempErrors.Phone = "Mobile is required";
        else if (!/^\d{10}$/.test(Phone)) tempErrors.Phone = "Mobile must be 10 digits";
        if (!type || type.trim() === "") tempErrors.Type = "Type is required";
        if (!Password || Password.trim() === "") tempErrors.Password = "Password is required";
        if (!cPassword || cPassword.trim() === "") tempErrors.cPassword = "Confirm Password is required";
        if (Password && cPassword && Password !== cPassword) tempErrors.cPassword = "Passwords do not match";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const addAdmin = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        const data = await axios.post(baseUrl + "admin/register", {
            Name,
            Phone,
            Password,
            user_type: type
        }).then((res) => {
            history.push("/admin/alladmins")
        })
    }

    return (
        <div>
            <h4 className='text-uppercase font-weight-bold my-3 text-light'>Add New Admin</h4>

            <form id="add_admin_form text-white" action="" method="post" style={{ backgroundColor: "rgba(0, 27, 11, 0.734)" }}>
                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label htmlFor="name">Name</label>
                        <input type="text" className="form-control" id="name" name="name" placeholder="Name" onChange={(e) => {
                            setName(e.target.value)
                        }} />
                        {errors.Name && <small className="text-danger">{errors.Name}</small>}
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="mobile">Mobile</label>
                        <input type="text" className="form-control form-control" maxLength={10} id="mobile" name="mobile" placeholder="Mobile" onChange={(e) => setPhone(e.target.value)} />
                        {errors.Phone && <small className="text-danger">{errors.Phone}</small>}
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label htmlFor="passowrd">Type</label>
                        <select className="form-control" name="" id="" onChange={(e) => setType(e.target.value)} defaultValue={type}>
                            <option value="Admin">Admin</option>
                            <option value="Agent">Agent</option>
                        </select>
                        {errors.Type && <small className="text-danger">{errors.Type}</small>}
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="passowrd">Password</label>
                        <input type="password" className="form-control" id="password" name="password" placeholder="Passowrd" onChange={(e) => {
                            setPassword(e.target.value)
                        }} />
                        {errors.Password && <small className="text-danger">{errors.Password}</small>}
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="mobile">Confirm Password</label>
                        <input type="password" className="form-control" id="confirm_password" name="confirm_password" placeholder="Confirm Passowrd" onChange={(e) => setCPassword(e.target.value)} />
                        {errors.cPassword && <small className="text-danger">{errors.cPassword}</small>}
                    </div>
                    <div className="form-group col-md-8">
                        <button type="submit" className="btn btn-success float-right" onClick={(e) => addAdmin(e)}>ADD ADMIN</button>
                    </div>
                </div>

            </form>

        </div>
    )
}
