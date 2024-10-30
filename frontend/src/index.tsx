import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import HomePage from "./pages/HomePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import ContactPage from "./pages/ContactPage";
import ComingSoonMessage from "./components/ComingSoonMessage";
import LibraryPage from "./pages/LibraryPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/contact",
    element: <ContactPage />,
    errorElement: <ErrorPage />,
    // ensure environment variables are set
    loader: function () {
      if (
        !import.meta.env.VITE_SERVICE_ID ||
        !import.meta.env.VITE_TEMPLATE_ID ||
        !import.meta.env.VITE_PUBLIC_KEY
      ) {
        throw new Response("Internal Server Error", {
          status: 500,
          statusText: "Incorrect server configuration",
        });
      }

      return new Response("OK", {
        status: 200,
        // can also add custom headers
        // headers: {
        //   "Content-Type": "application/json; utf-8",
        // },
      });
    },
  },
  { path: "/soon", element: <ComingSoonMessage /> },

  // TODO: should be protected by authentication and a paywall!
  { path: "/home", element: <LibraryPage /> },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
