import { useState, useEffect, useCallback } from 'react';
import validate from 'validate.js';
import _ from 'lodash';

function useForm(stateSchema, validationSchema = {}, callback) {
  const [state, setState] = useState(stateSchema);
  const [hasError, setHasError] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  console.log(state);

  // Disable button in initial render.
  /*
  useEffect(() => {
    setHasError(true);
  }, []);
  */

  // For every changed in our state this will be fired
  // To be able to disable the button
  useEffect(() => {
    if (isDirty) {
      setHasError(!validateState());
    }
  }, [state, isDirty]);

  // Used to disable submit button if there's an error in state
  // or the required field in state has no value.
  // Wrapped in useCallback to cached the function to avoid intensive memory leaked
  // in every re-render in component
  const validateState = useCallback(() => {
    if(_.isEmpty(validationSchema)){
	    return true;
    }
    const stateKeys = Object.keys(state);
    let validationState = {};
    for(var key of stateKeys){
      validationState[key] = state[key].value;
    }
    const errors = validate(validationState, validationSchema);
	
    if(!errors) return true;
    return false;
  }, [state, validationSchema]);

  // Used to handle every changes in every input
  const handleOnChange = useCallback(
    event => {
      if(isDirty === false) setIsDirty(true);

      const name = event.target.name;
      const value = event.target.type === 'number' ? parseInt(event.target.value) : event.target.value;

      let error = '';
      const validateErrors = validate({[name]: value}, validationSchema);
      if(validateErrors){
        error = validateErrors[name];
      }
      console.log(999, error, name, value);

      setState(prevState => ({
        ...prevState,
        [name]: { value, error },
      }));
    },
    [validationSchema]
  );
  
  //Used to handle submit (with state showing submitting (true||false))
  const handleOnSubmit = useCallback(
    async event => {
      if (event) event.preventDefault();

      // Make sure that validateState returns true
      // Before calling the submit callback function
      if (validateState()) {
        setSubmitting(true);
        await callback(state);
        setSubmitting(false);
      }
    },
    [state]
  );
  
  //Function to set initial state after submitting
  const setInitial = useCallback(
    () => {
      setState(stateSchema);
    }
  )
  
  return Object.assign([hasError, isDirty, state, handleOnChange, handleOnSubmit, submitting, setInitial], { hasError, isDirty, state, handleOnChange, handleOnSubmit, submitting, setInitial })
}

export default useForm;