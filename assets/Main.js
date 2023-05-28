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
    <Router>
      <Routes>
        <Route
          path='/'
          element={<ShowAppointment />}
        />
        <Route
          path='/addAppointment'
          element={<AddAppointment />}
        />
        <Route
          path='/editAppointment/:id'
          element={<EditAppointment />}
        />
        <Route
          path='/showAppointment/:id'
          element={<ViewAppointment />}
        />
      </Routes>
    </Router>
  );
}
export default Main;
if (document.getElementById("app")) {
  const rootElement = document.getElementById("app");
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <Main />
    </StrictMode>
  );
}
