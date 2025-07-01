import { Link, useSearchParams } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useEffect, useState } from "react";
import useFetch from "../useFetch";

export const LeadsByStatus = () => {
  // const { data: leads, loading, error } = UseLeadContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("");

  const [filters, setFilters] = useState({
    salesAgent: searchParams.get("salesAgent") || "",
    status: searchParams.get("status") || "",
    priority: searchParams.get("priority") || "",
  });

  console.log(filters);
  const {
    data: agents,
    loading: agentLoad,
    error: agentErro,
  } = useFetch(`${import.meta.env.VITE_BASE_API_URL}/agents`);

  useEffect(() => {
    const updatedFilters = {
      salesAgent: searchParams.get("salesAgent") || "",
      status: searchParams.get("status") || "",
      priority: searchParams.get("priority") || "",
    };

    setFilters(updatedFilters);

    const fetchLeads = async () => {
      setLoading(true);
      try {
        const queryString = searchParams.toString();
        const response = await fetch(
          `${import.meta.env.VITE_BASE_API_URL}/leads?${queryString || ""}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch leads: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data);
        if (data.length === 0) {
          setLeads([]);
        } else {
          setLeads(data);
        }
      } catch (error) {
        console.error("Error fetching leads:", error.message);
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const newFilters = {
      ...filters,
      [name]: value,
    };
    setFilters(newFilters);

    const updatedParams = new URLSearchParams();
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key]) {
        updatedParams.set(key, newFilters[key]);
      }
    });

    setSearchParams(updatedParams);
  };

  const sortData = (leads) => {
    if (!leads) return [];

    return leads?.sort((a, b) => {
      if (sortOrder === "Ascending") {
        return a.timeToClose - b.timeToClose; // Ascending order
      } else {
        return b.timeToClose - a.timeToClose; // Descending order
      }
    });
  };

  const sortedLeads = sortData(leads);

  if (loading || agentLoad) {
    return (
      <p
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        Loading...
      </p>
    );
  }

  if (agentErro) {
    return <div className="container pt-4 pb-5 ">Error loading data</div>;
  }

  return (
    <>
      <div className="container">
        <div className="row ">
          <Sidebar />

          <div
            className="col-12 col-md-8 d-flex flex-column  ms-0 ms-md-5"
            style={{ minHeight: "100vh", flexDirection: "column" }}
          >
            <h3 className="pb-5 text-center pt-4 fw-normal">Leads by Status</h3>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <label className="mb-1">
                  Status:
                  <select
                    className="form-select status-select ms-2"
                    name="status"
                    value={filters.status}
                    onChange={handleChange}
                  >
                    <option value="">All Status</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Closed">Closed</option>
                  </select>
                </label>
              </div>

              <div className="d-flex align-items-center ">
                <div className="d-flex flex-column">
                  <label className="mb-1">
                    Filters by :
                    <select
                      name="salesAgent"
                      className="form-select ms-2"
                      value={filters.salesAgent}
                      onChange={handleChange}
                    >
                      <option value="">All SalesAgent</option>

                      {agents?.map((agent) => (
                        <option key={agent._id} value={agent._id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                    <select
                      className="form-select status-select ms-2"
                      name="priority"
                      value={filters.priority}
                      onChange={handleChange}
                    >
                      <option value="">All Priority</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </label>
                </div>

                <label className="mb-1 ms-2">
                  Sort by :
                  <select
                    className="form-select status-select ms-2"
                    name="priority"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="" disabled>
                      TimetoClose
                    </option>
                    <option value="Ascending">Ascending</option>
                    <option value="Descending">Descending</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="row">
              {leads.length === 0 ? (
                <p>No leads found matching the selected filters.</p>
              ) : (
                sortedLeads?.map((lead) => (
                  <div className="col-md-3 col-sm-6 my-3">
                    <div class="card">
                      <div class="card-body">
                        <h5 class="card-title mb-3">{lead.name}</h5>
                        <p class="card-text">
                          <strong> TimetoClose:</strong> {lead.timeToClose} days
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
                        <div className="d-flex  justify-content-end mt-2">
                          <a
                            href={`/leads/${lead._id}`}
                            class="btn btn-sm btn-primary"
                          >
                            Details
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
