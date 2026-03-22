import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ReactPaginate from 'react-paginate'

export default function Allagent() {

    const [agents, setAgents] = useState([])
    const [loading, setLoading] = useState(true)
    
    // Pagination states
    const [pageNumber, setPageNumber] = useState(0)
    const [numberOfPages, setNumberOfPages] = useState(0)
    const [limit, setLimit] = useState(10)
    
    // Search states
    const [searchList, setSearchList] = useState("")
    const [searchType, setSearchType] = useState("0")
    
    const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
    const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
    const nodeMode = process.env.NODE_ENV;
    if (nodeMode === "development") {
      var baseUrl = beckendLocalApiUrl;
    } else {
      baseUrl = beckendLiveApiUrl;
    }

    // Phone number masking function
    const maskPhoneNumber = (phone) => {
        if (!phone) return "";
        const phoneStr = phone.toString();
        if (phoneStr.length >= 10) {
            return `91${phoneStr.slice(2, -2)}XX${phoneStr.slice(-2)}`;
        }
        return phoneStr;
    }

    // Pagination handler
    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1;
        setPageNumber(currentPage);
    }

    // Search handler
    const searchHandler = (event) => {
        let key = event.target.value
        setSearchList(key);
    }

    // Set page limit
    const setpageLimit = (event) => {
        let key = event.target.value
        setLimit(key);
    }

    const getAllAgents = async () => {
        try {
            setLoading(true)
            const access_token = localStorage.getItem('token')
            const headers = {
                Authorization: `Bearer ${access_token}`
            }
            
            const response = await axios.get(
                baseUrl + `agent/all?page=${pageNumber}&_limit=${limit}&_q=${searchList}&_stype=${searchType}`, 
                { headers }
            )
            
            setAgents(response.data.agents || response.data)
            setNumberOfPages(response.data.totalPages || 1)
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    const blockAgent = (agent) => {
        const confirmBox = window.confirm(`Are you sure you want to block ${agent.Name}?`);
        if (confirmBox === true) {
            const access_token = localStorage.getItem("token")
            const headers = {
                Authorization: `Bearer ${access_token}`
            }
            const userType = agent.user_type === 'Block' ? 'Agent' : 'Block';
            
            axios.post(baseUrl + `block/user/${agent._id}`, { user_type: userType }, { headers })
                .then((res) => {
                    getAllAgents()
                    alert("Agent status updated successfully!");
                })
                .catch((error) => {
                    console.log(error);
                    alert("Error updating agent status");
                })
        }
    }

    useEffect(() => {
        getAllAgents()
    }, [pageNumber, limit, searchList, searchType])

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{height: "50vh"}}>
                <div className="spinner-border text-light" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <>
            {/* <h4 className='text-uppercase font-weight-bold my-3'>all Agents list</h4> */}
            <div className="row bg-dark">
                <div className="col-12 grid-margin">
                    <div className="card bg-dark">
                        <div className="card-body text-light" style={{backgroundColor:"rgba(0, 27, 11, 0.734)"}}>
                            <h4 className="card-title text-light">All Agents List</h4>
                            
                            {/* Search and Filter Section */}
                            <div className='row mb-3'>
                                <select 
                                    className='form-control col-sm-3 m-2' 
                                    id='searchType' 
                                    name='searchtype' 
                                    onChange={(e) => setSearchType(e.target.value)}
                                >
                                    <option value="0">Select Search by</option>
                                    <option value="Name">Name</option>
                                    <option value="Phone">Phone</option>
                                    <option value="_id">Agent ID</option>
                                </select>
                                <input 
                                    type='text' 
                                    placeholder='Search...' 
                                    className='form-control col-sm-4 m-2' 
                                    onChange={searchHandler} 
                                />
                                <select 
                                    className='form-control col-sm-2 m-2 bg-dark text-light' 
                                    id='pagelimit' 
                                    name='pagelimit' 
                                    onChange={setpageLimit}
                                >
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>

                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Mobile</th>
                                            <th>Referral Code</th>
                                            <th>Commission (%)</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    {agents && agents.map((agent, key) => (
                                        <tbody key={agent._id}>
                                            <tr>
                                                <td>{key + 1}</td>
                                                <td>{agent._id}</td>
                                                <td>
                                                    <span className="pl-2">{agent.Name}</span>
                                                </td>
                                                <td>
                                                    <a 
                                                        className="cxy flex-column" 
                                                        href={`https://api.whatsapp.com/send?phone=+91${agent.Phone}&text=Hello`}
                                                    >
                                                        {maskPhoneNumber(agent.Phone)}
                                                    </a>
                                                </td>
                                                <td>{agent.referral_code || "N/A"}</td>
                                                <td>{agent.commission_percentage || 10}%</td>
                                                <td>
                                                    <div className="badge badge-outline-success">Active</div>
                                                </td>
                                                <td>
                                                    <button 
                                                        type='button' 
                                                        className={`btn mx-1 ${agent.user_type === 'Block' ? 'btn-success' : 'btn-danger'}`} 
                                                        onClick={() => blockAgent(agent)}
                                                    >
                                                        {agent.user_type === "Block" ? "Unblock" : "Block"}
                                                    </button>
                                                    <Link 
                                                        type='button' 
                                                        className="btn btn-outline-info mx-1" 
                                                        to={`/agent/edit/${agent._id}`}
                                                    >
                                                        Edit
                                                    </Link>
                                                    <Link 
                                                        type='button' 
                                                        className="btn btn-outline-info mx-1" 
                                                        to={`/agent/permissions/${agent._id}`}
                                                    >
                                                        Grant Permission
                                                    </Link>
                                                </td>
                                            </tr>
                                        </tbody>
                                    ))}
                                </table>
                            </div>

                            {/* Pagination */}
                            {numberOfPages > 1 && (
                                <div className='mt-4'>
                                    <ReactPaginate
                                        previousLabel={"Previous"}
                                        nextLabel={"Next"}
                                        breakLabel={"..."}
                                        pageCount={numberOfPages}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={3}
                                        onPageChange={handlePageClick}
                                        containerClassName={"pagination justify-content-center"}
                                        pageClassName={"page-item"}
                                        pageLinkClassName={"page-link"}
                                        previousClassName={"page-item"}
                                        previousLinkClassName={"page-link"}
                                        nextClassName={"page-item"}
                                        nextLinkClassName={"page-link"}
                                        breakClassName={"page-item"}
                                        breakLinkClassName={"page-link"}
                                        activeClassName={"active"}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
