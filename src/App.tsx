import { Routes, Route } from "react-router-dom";
import Layout from "./Layout.tsx";
import Home from "./pages/Home.tsx";
import CarrierIntake from "./pages/CarrierIntake.tsx";
import Contact from "./pages/Contact.tsx";
import GetHelp from "./pages/GetHelp.tsx";
import BecomeHelper from "./pages/BecomeHelper.tsx";
import Login from "./pages/Login.tsx";
import CreateAccount from "./pages/CreateAccount.tsx";
import CustomerDashboard from "./pages/CustomerDashboard.tsx";
import HelperDashboard from "./pages/HelperDashboard.tsx";
import WaitingForApproval from "./pages/WaitingForApproval.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
              {/* New Trucking Dispatch Routes */}
              <Route index element={<Home />} />
              <Route path="carrier-intake" element={<CarrierIntake />} />
              <Route path="contact" element={<Contact />} />
              <Route path="admin" element={<AdminDashboard />} />

              {/* Legacy Roadside Assistance Routes (Kept for future use, but not actively linked) */}
              <Route path="get-help" element={<GetHelp />} />
              <Route path="become-helper" element={<BecomeHelper />} />
              <Route path="login" element={<Login />} />
              <Route path="create-account" element={<CreateAccount />} />
              <Route path="customer-dashboard" element={<CustomerDashboard />} />
              <Route path="helper-dashboard" element={<HelperDashboard />} />
              <Route path="waiting-for-approval" element={<WaitingForApproval />} />
            </Route>
    </Routes>
  );
}