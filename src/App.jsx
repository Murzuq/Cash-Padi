import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TransferPage from "./pages/TransferPage";
import AirtimePage from "./pages/AirtimePage";
import DataPage from "./pages/DataPage";
import BillsPage from "./pages/BillsPage";
import TransactionHistoryPage from "./pages/TransactionHistoryPage";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="transfer" element={<TransferPage />} />
          <Route path="airtime" element={<AirtimePage />} />
          <Route path="data" element={<DataPage />} />
          <Route path="bills" element={<BillsPage />} />
          <Route path="history" element={<TransactionHistoryPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
