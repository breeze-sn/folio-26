import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import Breeze from "./components/breeze/Breeze.jsx";
import Cursor from "./components/ui/Cursor.jsx";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<><Cursor /><App /></>} />
          <Route path="/breeze" element={<Breeze />} />
          <Route path="*" element={<><Cursor /><App /></>} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
