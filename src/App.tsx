import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AgentRosterProvider } from "./store/AgentRosterContext";
import { AuthProvider, useAuth } from "./store/AuthContext";
import { DashboardLayout } from "./components/Layout/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { AgentList } from "./pages/AgentList";
import { AgentProfile } from "./pages/AgentProfile";
import { BrokerageList } from "./pages/BrokerageList";
import { BrokerageProfile } from "./pages/BrokerageProfile";
import { OfficeList } from "./pages/OfficeList";
import { OfficeProfile } from "./pages/OfficeProfile";
import { Login } from "./pages/Login";

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
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
  );
}

function LoginRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Login />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
