import { Button } from "react-bootstrap";
import { Sidebar } from "./Sidebar";
import UseLeadContext from "../contexts/LeadContext";
import "../App.css";
import { useState } from "react";
import toast from "react-hot-toast";

export const Dashboard = () => {
  const [status, setStatus] = useState("All");
  const { data, loading, error } = UseLeadContext();

  let data1 = data;
  let filterStatus = [];

  if (status != "All") {
    filterStatus = data?.filter((lead) => lead.status == status);
    if (filterStatus.length > 0) {
      data1 = filterStatus;
    } else {
      data1 = [];
    }
  }

  function handleDeleteLeadById(leadId) {
    fetch(`${import.meta.env.VITE_BASE_API_URL}/leads/${leadId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed ");
        return res.json();
      })
      .then(() => {
        toast.success("Lead deleted successfully  ✅");
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Delete failed ❌");
      });
  }

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="container pt-4 pb-5 ">Error loading data</div>;
  }
  return data ? (
    <>
      <div className="container ">
        <div className="row ">
          <Sidebar />

          <div className="col-md-9 p-3 ">
            <h2 className="text-center py-4 fw-normal">
              Anvaya CRM Dashboard{" "}
            </h2>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-normal">All Leads</h4>

              <div className="d-flex align-items-center gap-3">
                <div className="d-flex flex-column me-3">
                  <label className="mb-1">
                    Filters by status:
                    <select
                      className="form-select status-select"
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="All">All</option>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </label>
                </div>

                <Button variant="primary" href="/leadForm">
                  Add New Lead
                </Button>
              </div>
            </div>

            <div className="row">
              {data1 && data1.length > 0 ? (
                data1.map((lead) => (
                  <div className="col-md-3 col-sm-6 my-3">
                    <div class="card">
                      <div class="card-body">
                        <h5 class="card-title mb-3">{lead.name}</h5>
                        <p class="card-text">
                          <strong> Source:</strong> {lead.source}
                        </p>
                        <p class="card-text">
                          <strong>SalesAgent: </strong>
                          {lead.salesAgent.name}
                        </p>
                        <p class="card-text">
                          <strong>Priority: </strong>
                          {lead.priority}
                        </p>
                        <p class="card-text">
                          <strong>Status: </strong>
                          {lead.status}
                        </p>
                        <div className="d-flex  justify-content-between mt-2">
                          <a
                            href={`/leads/${lead._id}`}
                            class="btn btn-sm btn-primary"
                          >
                            Details
                          </a>
                          <div>
                            <button
                              className="btn btn-sm btn-danger "
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteLeadById(lead._id);
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No leads found</p>
              )}
            </div>

            <h5 className="py-2">Lead Status:</h5>
            <ul>
              <li className="my-2">
                New:
                <strong className="mx-2">
                  {data?.filter((lead) => lead.status == "New").length}
                </strong>
                Leads
              </li>
              <li className="my-2">
                Contacted:
                <strong className="mx-2">
                  {data?.filter((lead) => lead.status == "Contacted").length}
                </strong>
                Leads
              </li>
              <li className="my-2">
                Qualified:
                <strong className="mx-2">
                  {data?.filter((lead) => lead.status == "Qualified").length}
                </strong>
                Leads
              </li>
              <li className="my-2">
                Proposal Sent:
                <strong className="mx-2">
                  {
                    data?.filter((lead) => lead.status == "Proposal Sent")
                      .length
                  }
                </strong>
                Leads
              </li>
              <li className="my-2">
                Closed:
                <strong className="mx-2">
                  {data?.filter((lead) => lead.status == "Closed").length}
                </strong>
                Leads
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  ) : (
    <p
      className="d-flex justify-content-center align-items-center"
      style={{ height: "50vh" }}
    >
      Loading...
    </p>
  );
};
