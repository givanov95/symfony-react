import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddAppointment from "./pages/AddAppointment";
import EditAppointment from "./pages/EditAppointment";
import ShowAppointment from "./pages/ShowAppointment";
import ViewAppointment from "./pages/ViewAppointment";

function Main() {
  return (
    <Routes>
      <Route path="/" element={<ShowAppointment />} />
      <Route path="/appointments/create" element={<AddAppointment />} />
      <Route path="/appointments/edit/:id" element={<EditAppointment />} />
      <Route path="/appointments/show/:id" element={<ViewAppointment />} />
    </Routes>
  );
}

export default Main;
