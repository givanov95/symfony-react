import React from "react";

const SubmitButton = ({ isSaving, submit, text }) => {
  return (
    <button
      disabled={isSaving}
      onClick={submit}
      type="button"
      className="btn btn-primary mt-3"
    >
      {isSaving && <span className="spinner-border spinner-border-sm" />}
      {text}
    </button>
  );
};

export default SubmitButton;

