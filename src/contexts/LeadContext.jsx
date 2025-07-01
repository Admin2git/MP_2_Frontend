import { createContext, useContext, useState } from "react";
import useFetch from "../useFetch";

const leadContext = createContext();
const UseLeadContext = () => useContext(leadContext);

export default UseLeadContext;

export function LeadManageProvider({ children }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "New",
    priority: "Medium",
    timeToClose: 1,
    tags: [],
  });
  const { data, loading, error } = useFetch(
    `${import.meta.env.VITE_BASE_API_URL}/leads`
  );

  return (
    <leadContext.Provider
      value={{
        data,
        error,
        loading,
        formData,
        setFormData,
        isEditing,
        setIsEditing,
        editingLeadId,
        setEditingLeadId,
      }}
    >
      {children}
    </leadContext.Provider>
  );
}
