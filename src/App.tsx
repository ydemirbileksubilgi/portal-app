import { BrowserRouter as Router, Routes, Route } from "react-router"
import SideBar from "./component/layout/SideBar";
import ApproveList from "./pages/ApproveList";
import ApproveDetails from "./pages/ApproveDetails";

function App() {
  return (
    <Router>
      <SideBar>
        <Routes>
          <Route path="/quotation-all" element={<ApproveList />} />
          <Route path="/quotation-my-step" element={<ApproveDetails/>}/>
          {/* başka sayfalar da ekleyebilirsin */}
        </Routes>
      </SideBar>
    </Router>
  );
}

export default App;
