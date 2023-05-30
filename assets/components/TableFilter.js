import React from "react";
import Input from "./Input";

const TableFilter = ({
  dateFrom,
  dateTo,
  name,
  personalNumber,
  setDateFrom,
  setDateTo,
  setName,
  setPersonalNumber,
}) => {
  const handleDateFromChange = (value) => {
    setDateFrom(value);
  };

  const handleDateToChange = (value) => {
    setDateTo(value);
  };

  const handleNameChange = (value) => {
    setName(value);
  };

  const handlePersonalNumberChange = (value) => {
    setPersonalNumber(value);
  };

  return (
    <div className="form-row mb-3">
      <div className="col mb-2">
        <Input
          label="From:"
          value={dateFrom}
          onChange={handleDateFromChange}
          type="date"
          id="dateFrom"
          name="dateFrom"
        />
      </div>

      <div className="col mb-2">
        <Input
          label="To:"
          value={dateTo}
          onChange={handleDateToChange}
          type="date"
          id="dateTo"
          name="dateTo"
        />
      </div>

      <div className="col mb-2">
        <Input
          label="Client Name:"
          value={name}
          onChange={handleNameChange}
          type="text"
          id="name"
          name="name"
        />
      </div>

      <div className="col mb-2">
        <Input
          label="Personal Number:"
          value={personalNumber}
          onChange={handlePersonalNumberChange}
          type="text"
          id="personalNumber"
          name="personalNumber"
        />
      </div>
    </div>
  );
};

export default TableFilter;

