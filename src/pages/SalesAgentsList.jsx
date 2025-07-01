import { Sidebar } from "../components/Sidebar";
import useFetch from "../useFetch";
import { Button } from "react-bootstrap";
import toast from "react-hot-toast";

export const SalesAgentsList = () => {
  const { data: agents } = useFetch(
    `${import.meta.env.VITE_BASE_API_URL}/agents`
  );

  const handleDeletAgent = (agentId) => {
    fetch(`${import.meta.env.VITE_BASE_API_URL}/agents/${agentId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed ");
        return res.json();
      })
      .then(() => {
        toast.success("Agent deleted successfully  ✅");
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Delete failed ❌");
      });
  };
  return agents ? (
    <>
      <div className="container">
        <div className="row ">
          <Sidebar />

          <div
            className="col-12 col-md-8 d-flex flex-column ms-0 ms-md-5"
            style={{ minHeight: "100vh", flexDirection: "column" }}
          >
            <h3 className=" pt-4 fw-normal text-center my-4">
              SalesAgent Overview
            </h3>

            <div className="d-flex justify-content-between align-items-center py-3">
              <h4 className="fw-normal">All SalesAgents</h4>

              
                <Button variant="primary" href="/agentForm">
                  Add New salesAgent
                </Button>
           
            </div>

            <div class="card col-12 ">
              <div class="card-body px-4">
                <ul class="list-group list-group-flush">
                  <div className="row py-2">
                    <div className="col-12 col-sm-4 col-md-5">
                      <strong>Agents Name:</strong>
                    </div>
                    <div className="col-12 col-sm-4 col-md-5">
                      <strong>Email: </strong>
                    </div>
                  </div>
                  {agents && agents.length > 0 ? (
                    agents.map((agent) => (
                      <>
                        <div key={agent._id} className="row py-2">
                          <div className="col-12 col-sm-4 col-md-5">
                            <div className="list-group-item">{agent.name}</div>
                          </div>
                          <div className="col-12 col-sm-4 col-md-5">
                            <div className="list-group-item">{agent.email}</div>
                          </div>
                          <div className="col-12 col-sm-4 col-md-2">
                            <button
                              className="btn btn-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletAgent(agent._id);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </>
                    ))
                  ) : (
                    <p>No salesAgent found</p>
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
