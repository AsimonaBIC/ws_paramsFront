import React from "react";
import{ BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from "./pages/login/Login.jsx";
import Table from "./pages/table/Table.jsx";

export default function App(){
  return (
  <BrowserRouter>
    <Routes>
      <Route path = "/login" element={<Register />} />
      <Route path = "/table" element={<Table />} />
      <Route path = "/" element={<Register />} />
    </Routes>
  </BrowserRouter>
  );
}
