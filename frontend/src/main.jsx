import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import axios  from "axios";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./routes/Router";
import { UserContextProvider } from "./Context/UserContext";
import { ProjectContextProvider } from "./Context/ProjectContext";
axios.defaults.baseURL = "http://localhost:5000/";
axios.defaults.withCredentials = true; 
const localToken = localStorage.getItem("token");
if (localToken && localToken !== 'null' && localToken !== 'undefined') {
  axios.defaults.headers.common["Authorization"] = `Bearer ${localToken}`;
}

createRoot(document.getElementById("root")).render(
      <ProjectContextProvider>
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
    </ProjectContextProvider>
);
