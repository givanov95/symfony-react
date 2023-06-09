import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import BackButton from "../components/BackButton";

function ViewAppointment() {
  const { id } = useParams();
  const [entity, seEntity] = useState(null);
  const [otherAppointments, setOtherAppointments] = useState([]);

  // Fetch the appointment list upon component mount
  useEffect(() => {
    fetchAppointmentData();
  }, []);

  // Get all data from controller
  const fetchAppointmentData = () => {
    axios
      .get(`/appointments/show/${id}`)
      .then(function (response) {
        const { entity, otherAppointments } = response.data;
        seEntity(entity);
        setOtherAppointments(otherAppointments);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // Format date and time to "hh:mm dd-mm-yyyy" format
  function formatDate(date) {
    const dateTime = new Date(date);
    const year = dateTime.getFullYear();
    const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
    const day = dateTime.getDate().toString().padStart(2, "0");
    const hours = dateTime.getHours().toString().padStart(2, "0");
    const minutes = dateTime.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes} ${day}-${month}-${year}`;
  }

  // If the entity is not available, display a loading message
  if (!entity) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        Loading appointment details...
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <BackButton />
      <h2 className="text-center mb-3">Appointment details</h2>

      <div className="row">
        <div className="card card-margin w-75 mx-auto">
          <div className="card-body">
            <div className="widget-49 d-flex flex-column align-items-center">
              <div className="widget-49-title-wrapper">
                <div className="widget-49-date-primary">
                  <span className="widget-49-date-day">
                    {new Date(entity.time).getDate()}
                  </span>

                  <span className="widget-49-date-month">
                    {new Date(entity.time).toLocaleString("en-US", {
                      month: "short",
                    })}
                  </span>
                </div>

                <div className="widget-49-meeting-info">
                  <span className="widget-49-pro-title fw-normal">
                    Name: {entity.name}
                  </span>

                  <span className="widget-49-meeting-time">
                    Date: {formatDate(entity.time)}
                  </span>

                  <span className="widget-49-meeting-time">
                    Personal Number: {entity.personal_number}
                  </span>
                </div>
              </div>

              <h5 className="text-center mt-2 mb-1">Description</h5>
              <div className="widget-49-meeting-item">{entity.description}</div>
            </div>
          </div>
        </div>
      </div>

      {otherAppointments.length > 0 && (
        <div>
          <h2 className="text-center mb-3">
            Others appointment with same client personal number
          </h2>

          <div className="row">
            {otherAppointments.map((otherAppointment, index) => (
              <div key={index} className="col-lg-4">
                <div className="card card-margin">
                  <div className="card-body">
                    <div className="widget-49">
                      <div className="widget-49-title-wrapper">
                        <div className="widget-49-date-primary">
                          <span className="widget-49-date-day">
                            {new Date(otherAppointment.time).getDate()}
                          </span>

                          <span className="widget-49-date-month">
                            {new Date(otherAppointment.time).toLocaleString(
                              "en-US",
                              {
                                month: "short",
                              }
                            )}
                          </span>
                        </div>

                        <div className="widget-49-meeting-info">
                          <span className="widget-49-pro-title fw-normal">
                            Name: {otherAppointment.name}
                          </span>

                          <span className="widget-49-meeting-time">
                            Date: {formatDate(otherAppointment.time)}
                          </span>

                          <span className="widget-49-meeting-time">
                            Personal Number: {otherAppointment.personal_number}
                          </span>
                        </div>
                      </div>

                      <h5 className="text-center mt-2 mb-1">Description</h5>
                      <div className="widget-49-meeting-item text-center">
                        {otherAppointment.description}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewAppointment;
