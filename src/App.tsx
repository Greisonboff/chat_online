import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import React from "react";
import Home from "./pages/Home";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Analytics />
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
