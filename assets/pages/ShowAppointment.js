import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import Pagination from "../components/Pagination";

function ShowAppointment() {
  const [listAppointment, setAppointmentList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 10;

  useEffect(() => {
    fetchAppointmentList();
  }, []);

  const fetchAppointmentList = () => {
    axios
      .get("/appointments")
      .then(function (response) {
        setAppointmentList(response.data);
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

  const lastAppointment = currentPage * appointmentsPerPage;
  const firstAppointment = lastAppointment - appointmentsPerPage;
  const currentAppointments = listAppointment.slice(
    firstAppointment,
    lastAppointment
  );

  const totalPages = Math.ceil(listAppointment.length / appointmentsPerPage);

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
    <div className='container'>
      <h2 className='text-center mt-5 mb-3'>Appointment</h2>
      <div className='card'>
        <div className='card-header'>
          <Link
            className='btn btn-primary'
            to='/appointments/create'>
            Add Appointment
          </Link>
        </div>
        <div className='card-body'>
          <table className='table table-striped table-hover table-bordered border-primary'>
            <thead>
              <tr>
                <th>№</th>
                <th>Name</th>
                <th>Personal number</th>
                <th>Time</th>
                <th>Description</th>
                <th width='250px'>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentAppointments.map((appointment, key) => {
                return (
                  <tr key={key}>
                    <td>{appointment.id}</td>
                    <td>{appointment.name}</td>
                    <td>{appointment.egn}</td>
                    <td>{new Date(appointment.time).toLocaleString()}</td>
                    <td>{appointment.description}</td>
                    <td>
                      <Link
                        className='btn btn-success mx-1'
                        to={`/appointments/edit/${appointment.uuid}`}>
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteRecord(appointment.uuid)}
                        className='btn btn-danger mx-1'>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
