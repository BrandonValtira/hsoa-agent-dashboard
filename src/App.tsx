import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AgentRosterProvider } from "./store/AgentRosterContext";
import { DashboardLayout } from "./components/Layout/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { AgentList } from "./pages/AgentList";
import { AgentProfile } from "./pages/AgentProfile";
import { BrokerageList } from "./pages/BrokerageList";
import { BrokerageProfile } from "./pages/BrokerageProfile";
import { OfficeList } from "./pages/OfficeList";
import { OfficeProfile } from "./pages/OfficeProfile";

function App() {
  return (
    <BrowserRouter>
      <AgentRosterProvider>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="agents" element={<AgentList />} />
            <Route path="agents/:id" element={<AgentProfile />} />
            <Route path="brokerages" element={<BrokerageList />} />
            <Route path="brokerages/:id" element={<BrokerageProfile />} />
            <Route path="offices" element={<OfficeList />} />
            <Route path="offices/:id" element={<OfficeProfile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AgentRosterProvider>
    </BrowserRouter>
  );
}

export default App;
