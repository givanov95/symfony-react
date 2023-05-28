import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

function ShowAppointment() {
  const [listAppointment, setAppointmentList] = useState([]);

  useEffect(() => {
    fetchAppointmentList();
  }, []);

  const fetchAppointmentList = () => {
    axios
      .get("/api/employee")
      .then(function (response) {
        setAppointmentList(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const deleteRecord = (id) => {
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
          .delete(`/api/appointment/${id}`)
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
  return (
    <div className='container'>
      <h2 className='text-center mt-5 mb-3'>Appointment</h2>
      <div className='card'>
        <div className='card-header'>
          <Link
            className='btn btn-primary'
            to='/addAppointment'>
            Add Appointment
          </Link>
        </div>
        <div className='card-body'>
          <table className='table table-striped table-hover table-bordered border-primary'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Personal number</th>
                <th>Time</th>
                <th>Description</th>
                <th width='250px'>Action</th>
              </tr>
            </thead>
            <tbody>
              {listAppointment.map((appointment, key) => {
                return (
                  <tr key={key}>
                    <td>{appointment.name}</td>
                    <td>{appointment.egn}</td>
                    <td>{appointment.time}</td>
                    <td>{appointment.description}</td>
                    <td>
                      <Link
                        className='btn btn-success mx-1'
                        to={`/editAppointment/${appointment.id}`}>
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteRecord(appointment.id)}
                        className='btn btn-danger mx-1'>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default ShowAppointment;
