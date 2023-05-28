import React from "react";

function Pagination(props) {
  return (
    <div className='pagination'>
      <button
        className='btn btn-primary mx-1'
        onClick={props.handlePrevPage}
        disabled={props.currentPage === 1}>
        Prev
      </button>
      {Array.from({ length: props.totalPages }, (_, index) => (
        <button
          key={index}
          className={`btn btn-primary mx-1 ${
            props.currentPage === index + 1 ? "active" : ""
          }`}
          onClick={() => props.handlePageClick(index + 1, index)}>
          {index + 1}
        </button>
      ))}
      <button
        className='btn btn-primary mx-1'
        onClick={props.handleNextPage}
        disabled={props.currentPage === props.totalPages}>
        Next
      </button>
    </div>
  );
}

export default Pagination;
