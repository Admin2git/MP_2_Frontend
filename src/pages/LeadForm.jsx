import { Sidebar } from "../components/Sidebar";
import useFetch from "../useFetch";
import Select from "react-select";
import UseLeadContext from "../contexts/LeadContext";
import { Toast } from "react-bootstrap";
import toast from "react-hot-toast";

export const LeadForm = () => {
  const {
    editingLeadId,
    setEditingLeadId,
    isEditing,
    setIsEditing,
    formData,
    setFormData,
  } = UseLeadContext();
  const {
    data: agents,
    loading,
    error,
  } = useFetch(`${import.meta.env.VITE_BASE_API_URL}/agents`);

  const handleSaveLead = () => {
    const leadData = {
      ...formData,
      timeToClose: Number(formData.timeToClose),
    };

    if (isEditing) {
      const updatedLead = { ...leadData, _id: editingLeadId };

      fetch(`${import.meta.env.VITE_BASE_API_URL}/leads/${editingLeadId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedLead),
      })
        .then((res) => {
          if (!res.ok) throw new Error("failed to update.");
          return res.json();
        })
        .then(() => {
          console.log(formData);
          toast.success("Lead updated successfully ✅");
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error updating lead ❌");
        });
    } else {
      const newLead = { ...leadData };
      console.log(newLead);
      fetch(`${import.meta.env.VITE_BASE_API_URL}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newLead),
      })
        .then((res) => {
          if (!res.ok) throw new Error(" failed to Add");
          return res.json();
        })
        .then(() => {
          console.log(newLead);
          toast.success("Lead added successfully ✅");
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error adding lead ❌");
        });
    }
    setFormData({
      name: "",
      source: "",
      salesAgent: "",
      status: "New",
      priority: "Medium",
      timeToClose: 1,
      tags: [],
    });
    setIsEditing(false);
    setEditingLeadId(null);
  };

  const tagOptions = [
    { value: "Urgent", label: "Urgent" },
    { value: "High Value", label: "High Value" },
    { value: "Follow-up", label: "Follow-up" },
    { value: "New Client", label: "New Client" },
  ];

  if (error)
    return <div className="container pt-4 pb-5 ">Error loading product</div>;

  return (
    <>
      <div className="container" style={{ height: "auto" }}>
        <div className="row ">
          <Sidebar />

          <div
            className="col p-3 d-flex  align-items-center"
            style={{ minHeight: "100vh", flexDirection: "column" }}
          >
            <h3 className=" fw-normal py-4">
              {isEditing ? "Update Lead" : "Add New Lead"}
            </h3>

            {agents && !loading ? (
              <div class="card col-md-9">
                <div class="card-body p-4">
                  <form>
                    <div class="row">
                      <div class=" mb-3">
                        <label class="form-label text-capitalize">
                          Lead name:
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          placeholder="Enter full name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>

                      <div class="col-md-6 mb-3">
                        <label class="form-label text-capitalize">
                          Lead Source:
                        </label>
                        <br />
                        <select
                          class="form-select w-100"
                          value={formData.source}
                          onChange={(e) =>
                            setFormData({ ...formData, source: e.target.value })
                          }
                        >
                          <option value="Website">Website</option>
                          <option value="Referral">Referral</option>
                          <option value="Cold Call">Cold Call</option>
                          <option value="Advertisement">Advertisement</option>
                          <option value="Email">Email</option>
                          <option value="Other">Others</option>
                        </select>
                      </div>

                      <div class="col-md-6 mb-3">
                        <label class="form-label text-capitalize">
                          Sales Agent:
                        </label>

                        <select
                          class="form-select w-100"
                          value={formData.salesAgent}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              salesAgent: e.target.value,
                            })
                          }
                        >
                          {agents.map((agent) => (
                            <option key={agent._id} value={agent._id}>
                              {agent.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div class="col-md-6 mb-3">
                        <label class="form-label text-capitalize">
                          Lead Status:
                        </label>
                        <select
                          class="form-select w-100"
                          value={formData.status}
                          onChange={(e) =>
                            setFormData({ ...formData, status: e.target.value })
                          }
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Proposal Sent">Proposal Sent</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                      <div class="col-md-6 mb-3">
                        <label class="form-label text-capitalize">
                          Priority:
                        </label>
                        <select
                          class="form-select w-100"
                          value={formData.priority}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              priority: e.target.value,
                            })
                          }
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                      <div class="col-md-6 mb-3">
                        <label class="form-label text-capitalize">
                          Time to Close:
                        </label>
                        <input
                          type="number"
                          class="form-control"
                          value={formData.timeToClose}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              timeToClose: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div class="col-md-6 mb-3">
                        <label class="form-label text-capitalize">
                          {" "}
                          Tags:{" "}
                        </label>
                        <Select
                          isMulti
                          options={tagOptions}
                          value={
                            Array.isArray(formData?.tags)
                              ? tagOptions.filter((option) =>
                                  formData.tags.includes(option.value)
                                )
                              : []
                          }
                          onChange={(selected) =>
                            setFormData({
                              ...formData,
                              tags: selected.map((s) => s.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  </form>
                </div>
                <button
                  className="btn btn-primary mx-3"
                  onClick={handleSaveLead}
                >
                  {isEditing ? "Update Lead" : "Save New Lead"}
                </button>
                <button
                  className="btn btn-secondary m-3"
                  onClick={() => {
                    setFormData({
                      name: "",
                      source: "",
                      salesAgent: "",
                      status: "New",
                      priority: "Medium",
                      timeToClose: 1,
                      tags: [],
                    });
                    setIsEditing(false);
                    setEditingLeadId(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <p
                className="d-flex justify-content-center align-items-center"
                style={{ height: "50vh" }}
              >
                Loading...
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
