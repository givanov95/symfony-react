import React from "react";

function Input(props) {
  const handleChange = (event) => {
    if (props.onChange) {
      props.onChange(event.target.value);
    }
  };

  return (
    <div className='form-group'>
      <label htmlFor='props.for'>{props.label}</label>
      <input
        onChange={handleChange}
        value={props.value}
        type={props.type}
        className='form-control'
        id={props.id}
        name={props.name}
        required
      />
    </div>
  );
}

export default Input;
