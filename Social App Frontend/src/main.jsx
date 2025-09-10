import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { DarkModeProvider } from "./store/darkModeContext";
import CreatePost from "./components/createPost.jsx";
import PostList from "./components/postList.jsx";
import LoginPage from "./components/loginPage.jsx";
import SignupPage from "./components/signupPage.jsx";
import MainLayout from "./components/MainLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import EventsPage from "./components/EventsPage.jsx";
import CreateEvent from "./components/Createevents.jsx";
import Placements from "./components/placements.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import Homepage from "./components/homePage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "/",
            element: <Homepage />,
          },
          {
            path: "home",
            element: <Homepage />,
          },
          {
            path: "create-post",
            element: (
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            ),
          },
          {
            path: "events",
            element: (
              <ProtectedRoute>
                <EventsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "/create-event",
            element: (
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            ),
          },
          {
            path: "placements",
            element: (
              <ProtectedRoute>
                <Placements />
              </ProtectedRoute>
            ),
          },
          {
            path: "/profile",
            element: (
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DarkModeProvider>
      <RouterProvider router={router} />
    </DarkModeProvider>
  </StrictMode>
);
