import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout.tsx";
import Home from "./pages/Home.tsx";
import GetHelp from "./pages/GetHelp.tsx";
import BecomeHelper from "./pages/BecomeHelper.tsx";
import Login from "./pages/Login.tsx";
import CreateAccount from "./pages/CreateAccount.tsx";
import CustomerDashboard from "./pages/CustomerDashboard.tsx";
import HelperDashboard from "./pages/HelperDashboard.tsx";
import WaitingForApproval from "./pages/WaitingForApproval.tsx";
import { JobProvider } from "./lib/jobStore.tsx";
import { AuthProvider } from "./lib/authStore.tsx";

export default function App() {
  return (
    <AuthProvider>
      <JobProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="get-help" element={<GetHelp />} />
              <Route path="become-helper" element={<BecomeHelper />} />
              <Route path="login" element={<Login />} />
              <Route path="create-account" element={<CreateAccount />} />
              <Route path="customer-dashboard" element={<CustomerDashboard />} />
              <Route path="helper-dashboard" element={<HelperDashboard />} />
              <Route path="waiting-for-approval" element={<WaitingForApproval />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </JobProvider>
    </AuthProvider>
  );
}
console.log('SUPABASE URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('SUPABASE KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY)