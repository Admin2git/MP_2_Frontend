import React, { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import UseLeadContext from "../contexts/LeadContext";
import useFetch from "../useFetch";
import { Button } from "react-bootstrap";

export const LeadLists = () => {
  const { data, loading, error } = UseLeadContext();
  const [status, setStatus] = useState("");
  const [salesAgent, setSalesAgent] = useState("");
  const [priority, setPriority] = useState("");
  const [sortBy, setSortBy] = useState("Time to Close");
  const [sortOrder, setSortOrder] = useState("Ascending");

  let data1 = data?.filter((lead) => {
    const statusMatch = status === "" || lead.status === status;
    const salesAgentMatch =
      salesAgent === "" || lead.salesAgent.name === salesAgent;
    const priorityMatch = priority === "" || lead.priority === priority;
    return statusMatch && salesAgentMatch && priorityMatch;
  });

  const priorityOrder = {
    Low: 1,
    Medium: 2,
    High: 3,
  };

  const sortData = (data) => {
    if (sortBy === "Priority") {
      return data?.sort((a, b) => {
        if (sortOrder === "Ascending") {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        } else {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
      });
    } else if (sortBy === "Time to Close") {
      return data?.sort((a, b) => {
        if (sortOrder === "Ascending") {
          return a.timeToClose - b.timeToClose; // Ascending order
        } else {
          return b.timeToClose - a.timeToClose; // Descending order
        }
      });
    }
    return data;
  };

  data1 = sortData(data1);

  const {
    data: agents,
    loading: agentLoad,
    error: agentErro,
  } = useFetch(`${import.meta.env.VITE_BASE_API_URL}/agents`);

  if (loading || agentLoad) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        Loading...
      </div>
    );
  }

  if (error || agentErro) {
    return <div className="container pt-4 pb-5 ">Error loading data</div>;
  }

  return data && agents ? (
    <>
      <div className="container-fluid">
        <div className="row ">
          <Sidebar />

          <div
            className="col-12 col-md-8 d-flex flex-column ms-0 ms-md-5"
            style={{ minHeight: "100vh", flexDirection: "column" }}
          >
            <h3 className=" pt-4 fw-normal text-center">Lead List Overview</h3>

            <div className=" py-4">
              <h6 className="status-select fw-normal">Filters by:</h6>
              <select
                className="form-select status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="" disabled>
                  All Status
                </option>
                <option value="">All</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Closed">Closed</option>
              </select>

              <select
                className="form-select "
                value={salesAgent}
                onChange={(e) => setSalesAgent(e.target.value)}
              >
                <option value="" disabled>
                  All SalesAgent
                </option>
                <option value="">All</option>
                {agents?.map((agent) => (
                  <option key={agent._id} value={agent.name}>
                    {agent.name}
                  </option>
                ))}
              </select>

              <select
                className="form-select ms-3"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="" disabled>
                  All Priority
                </option>

                <option value="">All</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="mb-4 d-flex justify-content-between">
              <div>
                <h6 className="status-select fw-normal">Sort by:</h6>

                <select
                  className="form-select "
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="Priority">Priority</option>
                  <option value="Time to Close">Time to Close</option>
                </select>

                <select
                  className="form-select ms-3"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="Ascending">Ascending</option>
                  <option value="Descending">Descending</option>
                </select>
              </div>

              <div className="">
                <Button variant="primary" href="/leadForm">
                  Add New Lead
                </Button>
              </div>
            </div>

            <div class="card col-12 mb-5">
              <div class="card-body px-4">
                <ul class="list-group list-group-flush">
                  <div className="row py-2">
                    <div className="col-12 col-sm-4 col-md-3">
                      <strong>Name:</strong>
                    </div>
                    <div className="col-12 col-sm-4 col-md-2">
                      <strong>Status: </strong>
                    </div>
                    <div className="col-12 col-sm-4 col-md-3">
                      <strong>Sales Agent: </strong>
                    </div>
                    <div className="col-12 col-sm-4 col-md-2">
                      <strong>priority: </strong>
                    </div>
                    <div className="col-12 col-sm-4 col-md-2">
                      <strong>timeToClose: </strong>
                    </div>
                  </div>
                  {data1 && data1.length > 0 ? (
                    data1.map((lead) => (
                      <>
                        <div key={lead._id} className="row py-2">
                          <div className="col-12 col-sm-4 col-md-3">
                            <div className="list-group-item">{lead.name}</div>
                          </div>
                          <div className="col-12 col-sm-4 col-md-2">
                            <div className="list-group-item">{lead.status}</div>
                          </div>
                          <div className="col-12 col-sm-4 col-md-3">
                            <div className="list-group-item">
                              {lead.salesAgent.name}
                            </div>
                          </div>
                          <div className="col-12 col-sm-4 col-md-2">
                            <div className="list-group-item">
                              {lead.priority}
                            </div>
                          </div>
                          <div className="col-12 col-sm-4 col-md-2">
                            <div className="list-group-item">
                              {lead.timeToClose} days
                            </div>
                          </div>
                        </div>
                      </>
                    ))
                  ) : (
                    <p>No leads found</p>
                  )}
                </ul>
              </div>
            </div>
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
