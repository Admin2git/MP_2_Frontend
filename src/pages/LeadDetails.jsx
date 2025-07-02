import { Link, useParams } from "react-router-dom";
import useFetch from "../useFetch";
import { Sidebar } from "../components/Sidebar";
import UseLeadContext from "../contexts/LeadContext";
import { useState } from "react";
import toast from "react-hot-toast";

export const LeadDetails = () => {
  const { leadId } = useParams();
  const [commentData, setCommentData] = useState({
    lead: "",
    author: "",
    commentText: "",
  });
  console.log(leadId);
  const {
    data: leadInfo,
    loading,
    error,
  } = useFetch(`${import.meta.env.VITE_BASE_API_URL}/leads/${leadId}`);
  console.log(leadInfo);

  const { data: commentsByLeadId } = useFetch(
    `${import.meta.env.VITE_BASE_API_URL}/leads/${leadId}/comments`
  );

  const { data: agents } = useFetch(
    `${import.meta.env.VITE_BASE_API_URL}/agents`
  );
  console.log(leadInfo);
  console.log(commentsByLeadId);

  const { setIsEditing, setEditingLeadId, setFormData } = UseLeadContext();

  const handleEdit = (leadInfo) => {
    setFormData({
      name: leadInfo.name,
      source: leadInfo.source,
      salesAgent: leadInfo.salesAgent._id,
      status: leadInfo.status,
      priority: leadInfo.priority,
      timeToClose: leadInfo.timeToClose,
      tags: leadInfo.tags,
    });
    setEditingLeadId(leadInfo._id);
    setIsEditing(true);
  };

  const handleCommentSave = (e) => {
    e.preventDefault();

    if (!commentData.author || !commentData.commentText) {
      toast.error("Please provide both your name and a comment.");
      return;
    }
    const newComment = { ...commentData };

    fetch(`${import.meta.env.VITE_BASE_API_URL}/leads/${leadId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newComment),
    })
      .then((res) => {
        if (!res.ok) throw new Error(" failed to Add");
        return res.json();
      })
      .then(() => {
        console.log(newComment);
        toast.success("Comment added successfully ✅");
        window.location.reload();

        setCommentData({
          lead: "",
          author: "",
          commentText: "",
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error adding comment ❌");
      });
  };

  if (error)
    return <div className="container pt-4 pb-5 ">Error loading product</div>;

  return (
    <>
      <div className="container " style={{ height: "auto" }}>
        <div className="row ">
          <Sidebar />

          <div
            className="col p-3 d-flex  align-items-center"
            style={{ minHeight: "100vh", flexDirection: "column" }}
          >
            {leadInfo && !loading && commentsByLeadId && agents ? (
              <>
                <h3 className="text-center py-4">
                  Lead Management: {leadInfo.name}
                </h3>
                <h4 className="mb-4">Lead Details</h4>
                <div class="card col-md-8 ">
                  <div class="card-header">
                    <h5 className="card-title my-3 text-primary">
                      Lead Name: {leadInfo.name}
                    </h5>
                  </div>
                  <div class="card-body ">
                    <p class="card-text">
                      <strong className="mx-2"> Sales Agent:</strong>
                      {leadInfo.salesAgent.name}
                    </p>
                    <p class="card-text">
                      <strong className="mx-2"> Lead Source: </strong>
                      {leadInfo.source}
                    </p>
                    <p class="card-text">
                      <strong className="mx-2"> Lead Status: </strong>
                      {leadInfo.status}
                    </p>
                    <p class="card-text">
                      <strong className="mx-2"> Priority: </strong>
                      {leadInfo.priority}
                    </p>
                    <p class="card-text">
                      <strong className="mx-2"> Time to Close: </strong>
                      {leadInfo.timeToClose} Days
                    </p>
                    <p class="card-text">
                      <strong className="mx-2"> Tags: </strong>
                      {leadInfo.tags?.map((tag) => tag).join(" , ")}
                    </p>

                    <div className="d-flex gap-2 justify-content-end mt-2">
                      <Link
                        to="/leadForm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(leadInfo);
                        }}
                        className="btn btn-secondary btn-outline-primary text-white"
                      >
                        Edit Lead
                      </Link>
                    </div>
                  </div>
                </div>

                <div class="card col-md-8 mt-4 mb-5">
                  <div class="card-header">
                    <h5 className="card-title my-3 text-primary text-center">
                      Comment Section
                    </h5>
                  </div>
                  <div class="card-body ">
                    {commentsByLeadId && commentsByLeadId.length > 0 ? (
                      commentsByLeadId.map((comment) => (
                        <>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <p class="card-text">
                                <strong className="mx-2">
                                  {comment.author.name}:
                                </strong>
                                {comment.createdAt?.split("T")[0]}
                              </p>
                              <p class="card-text">
                                <strong className="mx-2"> Comment: </strong>
                                {comment.commentText}
                              </p>
                            </div>
                          </div>
                          <hr />
                        </>
                      ))
                    ) : (
                      <p>
                        No comment yet
                        <hr />
                      </p>
                    )}

                    <div className="mt-4 ">
                      <h6 className="text-center">Add New Comment</h6>
                      <form onSubmit={handleCommentSave}>
                        <div className="form-group mt-3">
                          <label htmlFor="authorName">
                            Your Name (SalesAgent):
                          </label>

                          <select
                            class="form-select w-100"
                            value={commentData.author || ""}
                            onChange={(e) =>
                              setCommentData({
                                ...commentData,
                                author: e.target.value,
                              })
                            }
                          >
                            <option value="" disabled>
                              Select Name
                            </option>
                            {agents.map((agent) => (
                              <option key={agent._id} value={agent._id}>
                                {agent.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group mt-3">
                          <label htmlFor="newComment">Your Comment:</label>
                          <textarea
                            id="newComment"
                            className="form-control"
                            rows="2"
                            value={commentData.commentText}
                            onChange={(e) =>
                              setCommentData({
                                ...commentData,
                                commentText: e.target.value,
                              })
                            }
                            required
                          ></textarea>
                        </div>

                        <button
                          type="submit"
                          className="btn btn-sm btn-primary mt-3"
                        >
                          Submit Comment
                        </button>
                      </form>
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};
