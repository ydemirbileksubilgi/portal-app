import { BrowserRouter as Router, Routes, Route } from "react-router";
import SideBar from "./component/layout/SideBar";
import QuotationAll from "./pages/QuotationAll";
import Login from "./pages/Login";
import ProtectedRoute from "./component/ProtectedRoute";
import AuthRedirect from "./component/AuthRedirect";
import MyApproveStep from "./pages/MyApproveStep";
import ApproveDetails from "./pages/ApproveDetails";
function App() {
  return (
    <Router>
      <Routes>
        {/* Ana sayfa - Otomatik yönlendirme */}
        <Route path="/" element={<AuthRedirect />} />

        {/* Login sayfası */}
        <Route path="/login" element={<Login />} />

        {/* Korumalı sayfalar - Auth gerekli */}
        <Route
          path="/quotation-all"
          element={
            <ProtectedRoute>
              <SideBar>
                <QuotationAll />
              </SideBar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/quotation-my-step"
          element={
            <ProtectedRoute>
              <SideBar>
                <MyApproveStep />
              </SideBar>
            </ProtectedRoute>
          }
        />
        <Route
          path="/qutation-detail"
          element={
            <ProtectedRoute>
              <SideBar>
                <ApproveDetails />
              </SideBar>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
