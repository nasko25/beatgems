import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import HomePage from "./pages/HomePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import ContactPage from "./pages/ContactPage";

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
      console.log(process.env);
      if (
        !process.env.REACT_APP_SERVICE_ID ||
        !process.env.REACT_APP_TEMPLATE_ID ||
        !process.env.REACT_APP_PUBLIC_KEY
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
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
