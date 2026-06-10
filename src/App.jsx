import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { Dashboard } from "./pages/Dashboard";
import { Attendance } from "./pages/Attendance";
import { Tasks } from "./pages/Tasks";
import { Farmers } from "./pages/Farmers";
import { DemoPlots } from "./pages/DemoPlots";
import { Dealers } from "./pages/Dealers";
import { Bulk } from "./pages/Bulk";
import { Issues } from "./pages/Issues";
import { Media } from "./pages/Media";
import { Reports } from "./pages/Reports";
import { Approvals } from "./pages/Approvals";
import { Leaderboard } from "./pages/Leaderboard";
import { Settings } from "./pages/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "attendance", element: <Attendance /> },
      { path: "tasks", element: <Tasks /> },
      { path: "farmers", element: <Farmers /> },
      { path: "demo-plots", element: <DemoPlots /> },
      { path: "dealers", element: <Dealers /> },
      { path: "bulk", element: <Bulk /> },
      { path: "issues", element: <Issues /> },
      { path: "media", element: <Media /> },
      { path: "reports", element: <Reports /> },
      { path: "approvals", element: <Approvals /> },
      { path: "leaderboard", element: <Leaderboard /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
