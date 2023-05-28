import React, { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

function AddAppointment() {
  const [name, setName] = useState("");
  const [personalNumber, setPersonalNumber] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const saveRecord = () => {
    setIsSaving(true);
    let formData = new FormData();

    formData.append("name", name);
    formData.append("personalNumber", personalNumber);
    formData.append("time", time);
    formData.append("description", description);

    if (name == "" || personalNumber == "") {
      Swal.fire({
        icon: "error",
        title: "Name and EGN are required fields.",
        showConfirmButton: true,
        showCloseButton: true,
      });
      setIsSaving(false);
    } else {
      axios
        .post("/appointments", formData)
        .then(function (response) {
          Swal.fire({
            icon: "success",
            title: "Appointment has been added successfully!",
            showConfirmButton: true,
          });
          setIsSaving(false);
          setName("");
          setPersonalNumber("");
          setTime("");
          setDescription("");
        })
        .catch(function (error) {
          Swal.fire({
            icon: "error",
            title: "Oops, Something went wrong!",
            showConfirmButton: true,
          });
          setIsSaving(false);
        });
    }
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
            <div className='form-group'>
              <label htmlFor='name'>Name</label>
              <input
                onChange={(event) => {
                  setName(event.target.value);
                }}
                value={name}
                type='text'
                className='form-control'
                id='name'
                name='name'
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='personalNumber'>Personal Number</label>
              <input
                onChange={(event) => {
                  setPersonalNumber(event.target.value);
                }}
                value={personalNumber}
                type='text'
                className='form-control'
                id='personalNumber'
                name='personalNumber'
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='time'>Choice date</label>
              <input
                onChange={(event) => {
                  setTime(event.target.value);
                }}
                value={time}
                type='date'
                className='form-control'
                id='time'
                name='time'
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='description'>Description</label>
              <textarea
                onChange={(event) => {
                  setDescription(event.target.value);
                }}
                value={description}
                type='text'
                className='form-control'
                id='description'
                name='description'
                required
              />
            </div>

            <button
              disabled={isSaving}
              onClick={saveRecord}
              type='button'
              className='btn btn-primary mt-3'>
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default AddAppointment;
