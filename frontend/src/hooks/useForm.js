import { useState, useCallback } from 'react';

const useForm = (submitFunction, initialValue = {}) => {

  const [values, setValues] = useState(initialValue);
  

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
      submitFunction().then(setValues(initialValue))
  };

  const handleChange = (event) => {
    event.persist();
    let newEntryItem = values[event.target.name];
    let newValue = event.target.value
    if(Number.isInteger(newEntryItem)){
        newValue = parseInt(newValue);
    }
    setValues(values => ({ ...values, [event.target.name]: newValue }));
  };
  

  return [
    values,
    handleChange,
    handleSubmit
  ]
};

export default useForm;

