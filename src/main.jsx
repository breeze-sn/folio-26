import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Cursor from "./components/ui/Cursor.jsx";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <Cursor />
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
