import { BrowserRouter as Router, Routes, Route } from "react-router"
import SideBar from "./component/layout/SideBar";
import ApproveList from "./pages/ApproveList";
import ApproveDetails from "./pages/ApproveDetails";
import Login from "./pages/Login";
import ProtectedRoute from "./component/ProtectedRoute";
import AuthRedirect from "./component/AuthRedirect";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ana sayfa - Otomatik yönlendirme */}
        <Route path="/" element={<AuthRedirect />} />
        
        {/* Login sayfası */}
        <Route path="/login" element={<Login />} />
        
        {/* Korumalı sayfalar - Auth gerekli */}
        <Route path="/quotation-all" element={
          <ProtectedRoute>
            <SideBar>
              <ApproveList />
            </SideBar>
          </ProtectedRoute>
        } />
        <Route path="/quotation-my-step" element={
          <ProtectedRoute>
            <SideBar>
              <ApproveDetails />
            </SideBar>
          </ProtectedRoute>
        } />
        {/* Diğer korumalı sayfalar da burada eklenebilir */}
      </Routes>
    </Router>
  );
}

export default App;
