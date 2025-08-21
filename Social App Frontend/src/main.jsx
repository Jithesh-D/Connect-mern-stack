import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import CreatePost from "./components/createPost.jsx";
import PostList from "./components/postList.jsx";
import LoginPage from "./components/loginPage.jsx";
import SignupPage from "./components/signupPage.jsx";
import MainLayout from "./components/MainLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Events from "./components/events.jsx";
import CreateEvent from "./components/Createevents.jsx";

import Placements from "./components/placements.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Public routes
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      // Protected routes
      {
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "/",
            element: <PostList />,
          },
          {
            path: "home",
            element: <PostList />,
          },
          {
            path: "create-post",
            element: sessionStorage.getItem("user") ? (
              <CreatePost />
            ) : (
              <Navigate to="/signup" />
            ),
          },
          {
            path: "events",
            element: <CreateEvent />,
          },
          {
            path: "placements",
            element: <Placements />,
          },
          {
            path: "/create-event",
            element: <CreateEvent />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
