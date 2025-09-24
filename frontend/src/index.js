import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import UserHome from "./Main/user/Home";
import AdminHome from "./Main/admin/Home";
import SignIn from "./Auth_Component/SignIn";
import SignUp from "./Auth_Component/SignUp";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "user/:email/home",
    element: <UserHome />,
  },
  {
    path: "admin/:email/home",
    element: <AdminHome />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
