import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import Input from "../components/Input";
import ErrorAlert from "../components/ErrorAlert";

function EditAppointment({ history }) {
  const [uuid, setUuid] = useState(useParams().id);
  const [appointment, setAppointment] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorsBag, setErrorsBag] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    personal_number: "",
    time: "",
    description: "",
  });

  useEffect(() => {
    fetchAppointmentList();
  }, []);

  useEffect(() => {
    setFormData({
      name: appointment.name,
      personal_number: appointment.personal_number,
      time: appointment.time
        ? new Date(appointment.time).toISOString().split("T")[0]
        : "",
      description: appointment.description,
    });
  }, [appointment]);

  const fetchAppointmentList = () => {
    axios
      .get(`/appointments/edit/${uuid}`)
      .then(function (response) {
        setAppointment(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const updateRecord = () => {
    setIsSaving(true);

    const data = {
      name: formData.name,
      personal_number: formData.personal_number,
      time: formData.time,
      description: formData.description,
    };

    if (
      formData.name === "" ||
      formData.personal_number === "" ||
      formData.description === ""
    ) {
      Swal.fire({
        icon: "error",
        title: "Name, Personal Number and Description are required fields.",
        showConfirmButton: true,
        showCloseButton: true,
      });
      setIsSaving(false);
      return;
    }

    if (isNaN(formData.personal_number)) {
      Swal.fire({
        icon: "error",
        title: "Please enter a numeric value for the Personal Number.",
        showConfirmButton: true,
        showCloseButton: true,
      });
      setIsSaving(false);
      return;
    }

    if (formData.personal_number.length !== 10) {
      Swal.fire({
        icon: "error",
        title: "Please provide a 10-digit Personal Number.",
        showConfirmButton: true,
        showCloseButton: true,
      });
      setIsSaving(false);
      return;
    }

    axios
      .put(`/appointments/${uuid}`, data)
      .then(function (response) {
        Swal.fire({
          icon: "success",
          title: "Appointment has been updated successfully!",
          showConfirmButton: true,
        });
        setIsSaving(false);
        setFormData({
          name: appointment.name,
          personal_number: appointment.personal_number,
          time: appointment.time
            ? new Date(appointment.time).toISOString().split("T")[0]
            : "",
          description: appointment.description,
        });
        setErrorsBag([]);
        fetchAppointmentList();
      })
      .catch(function (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.length > 0
        ) {
          setErrorsBag(error.response.data);
        } else {
          setErrorsBag(["Oops, something went wrong!"]);
        }
        setIsSaving(false);
      });
  };

  return (
    <div className='container'>
      <h2 className='text-center mt-5 mb-3'>Add Appointment</h2>

      <div className='card'>
        <div className='card-header'>
          <Link
            className='btn btn-primary float-left mt-2 mb-2'
            to='/'>
            Back To Appointment List
          </Link>
        </div>

        <div className='card-body'>
          <ErrorAlert errorsBag={errorsBag} />

          <form>
            <Input
              label='Name'
              for='name'
              value={formData.name}
              type='text'
              id='name'
              name='name'
              onChange={(value) => handleInputChange("name", value)}
            />

            <Input
              label='Personal Number'
              for='personal-number'
              value={formData.personal_number}
              type='text'
              id='personal-number'
              name='personalNumber'
              maxLength='10'
              onChange={(value) => handleInputChange("personal_number", value)}
            />

            <Input
              label='Choice date'
              for='date'
              value={formData.time}
              type='date'
              id='date'
              name='dater'
              onChange={(value) => handleInputChange("time", value)}
            />

            <div className='form-group'>
              <label htmlFor='description'>Description</label>
              <textarea
                onChange={(event) =>
                  handleInputChange("description", event.target.value)
                }
                value={formData.description}
                type='text'
                className='form-control'
                id='description'
                name='description'
                required
              />
            </div>

            <button
              disabled={isSaving}
              onClick={updateRecord}
              type='button'
              className='btn btn-primary mt-3'>
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditAppointment;
