import React from "react";
import { Link } from "react-router-dom";

const Table = ({ columns, data, deleteRecord }) => {
  return (
    <table className="table table-striped table-hover table-bordered">
      <thead className="thead-dark">
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column}</th>
          ))}
          <th width="250px">Action</th>
        </tr>
      </thead>

      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {Object.entries(row).map(([key, value], index) => {
              if (key === "time") {
                value = new Date(value).toLocaleString();
              }

              if (key === "name") {
                return (
                  <td key={index}>
                    <Link
                      className="text-primary"
                      to={`/appointments/show/${row.uuid}`}
                    >
                      {value}
                    </Link>
                  </td>
                );
              }

              return key !== "uuid" && <td key={index}>{value}</td>;
            })}

            <td>
              <Link
                className="btn btn-success mx-1"
                to={`/appointments/edit/${row.uuid}`}
              >
                Edit
              </Link>

              <button
                onClick={() => deleteRecord(row.uuid)}
                className="btn btn-danger mx-1"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;

