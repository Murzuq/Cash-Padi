import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TransferPage from "./pages/TransferPage";
import AirtimePage from "./pages/AirtimePage";
import DataPage from "./pages/DataPage";
import BillsPage from "./pages/BillsPage";
import TransactionHistoryPage from "./pages/TransactionHistoryPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "transfer", element: <TransferPage /> },
          { path: "airtime", element: <AirtimePage /> },
          { path: "data", element: <DataPage /> },
          { path: "bills", element: <BillsPage /> },
          { path: "history", element: <TransactionHistoryPage /> },
        ],
      },
    ],
  },
  // Public routes
  {
    path: "/welcome", // You can keep this or remove it if / is the new landing
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
