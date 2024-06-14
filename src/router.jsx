import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import Stuff from "./pages/Stuff";
import TrashStuff from "./pages/TrashStuff";
import Inbound from "./pages/Inbound"; // Correct import for Inbound component
import InboundStuffs from "./pages/InboundStuffs"; // Correct import for InboundStuffs component
import Lending from "./pages/Lendings";

export const router = createBrowserRouter([
  { path: '/', element: <App/> },
  { path: '/login', element: <Login/> },
  { path: '/profile', element: <Profile /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/stuffs', element: <Stuff /> },
  { path: '/stuffs/trash', element: <TrashStuff /> },
  { path: '/inbound-stuffs', element: <Inbound /> }, // Correct path and component name
  { path: '/inbound-stuffs/data', element: <InboundStuffs /> }, // Correct path and component name
  { path: '/lendings', element: <Lending/>},
]);
