import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import Pagination from "../components/Pagination";
import Table from "../components/Table";

function ShowAppointment() {
  const [entity, setEntity] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [name, setName] = useState("");
  const [personalNumber, setPersonalNumber] = useState("");
  const appointmentsPerPage = 10;

  useEffect(() => {
    fetchAppointmentList();
  }, []);

  const fetchAppointmentList = () => {
    axios
      .get("/appointments")
      .then(function (response) {
        setEntity(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const deleteRecord = (uuid) => {
    Swal.fire({
      title: "Are you sure you want to delete this appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/appointments/${uuid}`)
          .then(function (response) {
            Swal.fire({
              icon: "success",
              title: "Appointment has been deleted successfully!",
              showConfirmButton: false,
              timer: 1000,
            });
            fetchAppointmentList();
          })
          .catch(function (error) {
            Swal.fire({
              icon: "error",
              title: "Oops, Something went wrong!",
              showConfirmButton: false,
              timer: 1000,
            });
          });
      }
    });
  };

  const filterAppointments = (appointments) => {
    const filteredAppointments = appointments.filter((appointment) => {
      const date = new Date(appointment.time);
      const filterFromDate = dateFrom ? new Date(dateFrom) : null;
      const filterToDate = dateTo ? new Date(dateTo) : null;
      const clientName = appointment.name.includes(name.toLowerCase());
      const appointmentPersonalNumber = appointment.personalNumber.includes(
        personalNumber.toLowerCase()
      );

      if (filterFromDate && date < filterFromDate) {
        return false;
      }
      if (filterToDate && date > filterToDate) {
        return false;
      }
      if (personalNumber && !appointmentPersonalNumber) {
        return false;
      }
      if (name && !clientName) {
        return false;
      }
      return true;
    });

    return filteredAppointments;
  };

  const lastAppointment = currentPage * appointmentsPerPage;
  const firstAppointment = lastAppointment - appointmentsPerPage;
  const filteredAppointments = filterAppointments(entity);
  const appointments = filteredAppointments.slice(
    firstAppointment,
    lastAppointment
  );

  const totalPages = Math.ceil(
    filteredAppointments.length / appointmentsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mt-5 mb-3">Appointment</h2>

      <div className="card">
        <div className="card-header">
          <Link className="btn btn-primary mt-2 mb-2" to="/appointments/create">
            Add Appointment
          </Link>
        </div>

        <div className="card-body">
          <div className="form-row mb-3">
            <div className="col mb-2">
              <label htmlFor="dateFrom">From:</label>
              <input
                type="date"
                id="dateFrom"
                className="form-control"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div className="col mb-2">
              <label htmlFor="dateTo">To:</label>
              <input
                type="date"
                id="dateTo"
                className="form-control"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            <div className="col mb-2">
              <label htmlFor="name">Client Name:</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="col mb-2">
              <label htmlFor="personalNumber">Personal Number:</label>
              <input
                type="text"
                id="personalNumber"
                className="form-control"
                value={personalNumber}
                onChange={(e) => setPersonalNumber(e.target.value)}
              />
            </div>
          </div>

          <Table
            columns={["№", "Name", "Personal number", "Time", "Description"]}
            data={appointments}
            deleteRecord={deleteRecord}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePrevPage={handlePrevPage}
            handleNextPage={handleNextPage}
            handlePageClick={(pageNumber) => {
              setCurrentPage(pageNumber);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ShowAppointment;
