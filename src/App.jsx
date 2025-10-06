import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TransferPage from "./pages/TransferPage";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="transfer" element={<TransferPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
