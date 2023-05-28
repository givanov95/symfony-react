import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import Input from "../components/Input";

function EditAppointment() {
  const [uuid, setUuid] = useState(useParams().id);
  const [appointment, setAppointment] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    personalNumber: "",
    time: "",
    description: "",
  });

  useEffect(() => {
    fetchAppointmentList();
  }, []);

  useEffect(() => {
    setFormData({
      name: appointment.name,
      personalNumber: appointment.egn,
      time: appointment.time
        ? new Date(appointment.time).toISOString().split("T")[0]
        : "",
      description: appointment.description,
    });
  }, [appointment]);

  console.log(formData);

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

  return (
    <div className='container'>
      <h2 className='text-center mt-5 mb-3'>Add Appointment</h2>
      <div className='card'>
        <div className='card-header'>
          <Link
            className='btn btn-info float-left'
            to='/'>
            Back To Appointment List
          </Link>
        </div>
        <div className='card-body'>
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
              value={formData.personalNumber}
              type='personalNumber'
              id='personal-number'
              name='personalNumber'
              onChange={(value) => handleInputChange("personalNumber", value)}
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

            {/* <button
              disabled={isSaving}
              onClick={updateRecord}
              type='button'
              className='btn btn-primary mt-3'>
              Update
            </button> */}
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditAppointment;
