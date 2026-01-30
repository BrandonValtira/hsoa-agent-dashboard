import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AgentRosterProvider } from "./store/AgentRosterContext";
import { DashboardLayout } from "./components/Layout/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { AgentList } from "./pages/AgentList";
import { AgentProfile } from "./pages/AgentProfile";

function App() {
  return (
    <BrowserRouter>
      <AgentRosterProvider>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="agents" element={<AgentList />} />
            <Route path="agents/:id" element={<AgentProfile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AgentRosterProvider>
    </BrowserRouter>
  );
}

export default App;
