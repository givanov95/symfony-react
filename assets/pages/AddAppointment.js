import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import Input from "../components/Input";

function AddAppointment() {
  const [formData, setFormData] = useState({
    name: "",
    personalNumber: "",
    time: "",
    description: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errorsBag, setErrorsBag] = useState([]);

  useEffect(() => {
    setFormData({
      name: "",
      personalNumber: "",
      time: "",
      description: "",
    });
  }, []);

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const saveRecord = () => {
    setIsSaving(true);
    let data = new FormData();

    data.append("name", formData.name);
    data.append("personalNumber", formData.personalNumber);
    data.append("time", formData.time);
    data.append("description", formData.description);

    if (
      formData.name === "" ||
      formData.personalNumber === "" ||
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

    if (isNaN(formData.personalNumber)) {
      Swal.fire({
        icon: "error",
        title: "Please enter a numeric value for the Personal Number.",
        showConfirmButton: true,
        showCloseButton: true,
      });
      setIsSaving(false);
      return;
    }

    if (formData.personalNumber.length !== 10) {
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
      .post("/appointments", data)
      .then(function (response) {
        Swal.fire({
          icon: "success",
          title: "Appointment has been added successfully!",
          showConfirmButton: true,
        });
        setIsSaving(false);
        setFormData({
          name: "",
          personalNumber: "",
          time: "",
          description: "",
        });
        setErrorsBag([]);
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
    <div className="container">
      <h2 className="text-center mt-5 mb-3">Add Appointment</h2>

      <div className="card">
        <div className="card-header">
          <Link className="btn btn-primary float-left" to="/">
            Back To Appointment List
          </Link>
        </div>

        <div className="card-body">
          {errorsBag.length > 0 && (
            <div className="alert alert-danger">
              {errorsBag.map((error, index) => (
                <div className="mb-2" key={index}>
                  {error}
                </div>
              ))}
            </div>
          )}

          <form>
            <Input
              label="Name"
              for="name"
              value={formData.name}
              type="text"
              id="name"
              name="name"
              onChange={(value) => handleInputChange("name", value)}
            />

            <Input
              label="Personal Number"
              for="personal-number"
              value={formData.personalNumber}
              type="personalNumber"
              id="personal-number"
              name="personalNumber"
              maxLength="10"
              onChange={(value) => handleInputChange("personalNumber", value)}
            />

            <Input
              label="Choice date"
              for="date"
              value={formData.time}
              type="date"
              id="date"
              name="dater"
              onChange={(value) => handleInputChange("time", value)}
            />

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                onChange={(event) =>
                  handleInputChange("description", event.target.value)
                }
                value={formData.description}
                type="text"
                className="form-control"
                id="description"
                name="description"
                required
              />
            </div>

            <button
              disabled={isSaving}
              onClick={saveRecord}
              type="button"
              className="btn btn-primary mt-3"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAppointment;
