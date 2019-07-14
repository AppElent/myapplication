import { useState, useCallback, useEffect } from 'react';
import { withAuth } from '@okta/okta-react';
import useFetch from '../hooks/useFetch';
import useForm from '../hooks/useForm';

const useFetchedForm = (auth, url, saveFunction, defaultvalues) => {

    const [data, setData, loading, error, request] = useFetch(url, {onMount: true}, auth, {success: false})
    const [config, handleChange, handleSubmit, submitting, changing, setInitial, setConfig ] = useForm(saveFunction, defaultvalues);
    
    if(data.length > 1){console.log('Meer dan 1 entry gevonden', data);alert('Meer dan 1 entry gevonden')}
    console.log(data, data.length)
    
    useEffect(() => {
        console.log('data is er', data);
        if(data.data !== undefined){
            let fetched = JSON.parse(data.data);
            fetched.id = data.id
            setConfig(fetched);
        }

    }, [data])

    return [config, handleChange, handleSubmit, setConfig, request]
}

export default useFetchedForm
