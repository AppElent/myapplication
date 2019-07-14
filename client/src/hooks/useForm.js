import { useState, useCallback } from 'react';

const useForm = (submitFunction, initialValue = {}) => {
  
  const [values, setValues] = useState(initialValue);
  const [changing, setChanging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    setSubmitting(true)
    if (event) event.preventDefault();
    await submitFunction()
    setSubmitting(false)
  };
  
  const setInitial = () => {
    setValues(initialValue)
  }

  const handleChange = (event) => {
    setChanging(true)
    event.persist();
    let newEntryItem = values[event.target.name];
    let newValue = event.target.value
    if(Number.isInteger(newEntryItem)){
        newValue = parseInt(newValue);
    }
    setValues(values => ({ ...values, [event.target.name]: newValue }));
    setChanging(false)
  };
  
  return Object.assign([values, handleChange, handleSubmit, submitting, changing, setInitial, setValues], { values, handleChange, handleSubmit, submitting, changing, setInitial, setValues })
};

export default useForm;

