import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { baseUrl } from "../config";

export default function Conflictgame() {
  const [challenge, setchallenge] = useState();
  const [loading, setLoading] = useState(true);
  
  //use for pagination..
  let limit = 10;
  const [pageNumber, setPageNumber] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);

  //react paginate..
  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    setPageNumber(currentPage);
  };

  const Allchallenge = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    setLoading(true);
    axios
      .get(baseUrl + `admin/challange/dashboard/all?page=${pageNumber}&_limit=${limit}`, { headers })
      .then((res) => {
        setchallenge(res.data.status);
        setNumberOfPages(res.data.totalPages);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching challenges:", err);
        setLoading(false);
      });
  };

  const dateFormat = (e) => {
    if (!e) return "N/A";
    const date = new Date(e);
    return date.toLocaleString('default', { month: 'short', day: 'numeric', hour: 'numeric', hour12: true, minute: 'numeric' });
  };

  useEffect(() => {
    Allchallenge();
  }, [pageNumber, limit, Allchallenge]);

  return (
    <div className="row mb-4 animate__animated animate__fadeIn">
      <div className="col-12 grid-margin">
        <div className="card lw-card-white shadow-sm border-0">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="card-title mb-0 font-weight-bold" style={{fontFamily: 'Baloo 2', color: '#1A1A2E'}}>
                Recent Games / Challenges
              </h4>
              <Link to="/all-challenges" className="btn btn-sm btn-outline-success">View All</Link>
            </div>
            
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div className="table-responsive">
                  <table className="table table-hover lw-modern-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Game ID</th>
                        <th>Player 1</th>
                        <th>Player 2</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {challenge && challenge.length > 0 ? (
                        challenge.map((game, key) => (
                          <tr key={game._id}>
                            <td>{key + 1 + (pageNumber * limit)}</td>
                            <td><small className="text-muted">#{game._id?.slice(-6)}</small></td>
                            <td><span className="font-weight-medium">{game.Created_by?.Name || "System"}</span></td>
                            <td><span className="font-weight-medium">{game.Accepetd_By?.Name || "Waiting..."}</span></td>
                            <td><span className="text-dark font-weight-bold">₹{game.Game_Ammount}</span></td>
                            <td>
                              <span className={`badge badge-pill ${
                                game.Status === 'Completed' ? 'badge-soft-success' : 
                                game.Status === 'Cancelled' ? 'badge-soft-danger' : 'badge-soft-warning'
                              }`}>
                                {game.Status}
                              </span>
                            </td>
                            <td>{game.Game_type}</td>
                            <td><small>{dateFormat(game.createdAt)}</small></td>
                            <td>
                              <Link className="btn btn-xs lw-btn-gradient-green text-white" to={`/view/${game._id}`}>
                                Details
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="9" className="text-center py-4 text-muted">No recent games found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {numberOfPages > 1 && (
                  <div className="mt-4">
                    <ReactPaginate
                      previousLabel={"<"}
                      nextLabel={">"}
                      breakLabel={"..."}
                      pageCount={numberOfPages}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={3}
                      onPageChange={handlePageClick}
                      containerClassName={"pagination lw-pagination justify-content-center"}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

