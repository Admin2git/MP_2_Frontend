import React, { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import toast from "react-hot-toast";

export const AgentForm = () => {
  const [agentformData, setAgentFormData] = useState({
    name: "",
    email: "",
  });
  const handleSaveAgent = () => {
    const newAgent = { ...agentformData };
    console.log(newAgent);
    fetch(`${import.meta.env.VITE_BASE_API_URL}/agents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAgent),
    })
      .then((res) => {
        if (!res.ok) throw new Error(" failed to Add");
        return res.json();
      })
      .then(() => {
        console.log(newAgent);
        toast.success("Agent added successfully ✅");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error adding Agent ❌");
      });
    setAgentFormData({
      name: "",
      email: "",
    });
  };
  return (
    <>
      <div className="container">
        <div className="row ">
          <Sidebar />

          <div
            className="col-12 col-md-8 d-flex flex-column align-items-center ms-0 ms-md-5"
            style={{ minHeight: "100vh", flexDirection: "column" }}
          >
            <h4 className=" pt-4 fw-normal text-center mt-4 mb-5">
              Add New Sales Agent
            </h4>

            <div className="card col-md-8">
              <div className="card-body p-4">
                <form>
                  <div className="row">
                    <div className=" mb-3">
                      <label className="form-label text-capitalize">
                        Agent name:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={agentformData.name}
                        onChange={(e) =>
                          setAgentFormData({
                            ...agentformData,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className=" mb-3">
                      <label className="form-label text-capitalize">
                        Email:
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        value={agentformData.email}
                        onChange={(e) =>
                          setAgentFormData({
                            ...agentformData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </form>
              </div>
              <button
                className="btn btn-primary mx-3"
                onClick={handleSaveAgent}
              >
                Save New Agent
              </button>
              <button
                className="btn btn-secondary m-3 "
                onClick={() => {
                  setAgentFormData({
                    name: "",
                    email: "",
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
