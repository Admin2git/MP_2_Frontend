import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { LeadManageProvider } from "./contexts/LeadContext";
import { LeadDetails } from "./pages/LeadDetails";
import { LeadForm } from "./pages/LeadForm";
import { LeadLists } from "./pages/LeadLists";
import { SalesAgentsList } from "./pages/SalesAgentsList";
import { AgentForm } from "./pages/AgentForm";
import { Reports } from "./pages/Reports";
import { LeadsByStatus } from "./pages/LeadsByStatus";
import { LeadsByAgent } from "./pages/LeadsByAgent";

function App() {
  return (
    <>
      <Router>
        <LeadManageProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/leads/:leadId" element={<LeadDetails />} />
            <Route path="/leadForm" element={<LeadForm />} />
            <Route path="/leadsOverview" element={<LeadLists />} />
            <Route path="/salesAgent" element={<SalesAgentsList />} />
            <Route path="/agentForm" element={<AgentForm />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/leadsByStatus" element={<LeadsByStatus />} />
            <Route path="/leadsByAgent" element={<LeadsByAgent />} />
          </Routes>
        </LeadManageProvider>
      </Router>
    </>
  );
}

export default App;
