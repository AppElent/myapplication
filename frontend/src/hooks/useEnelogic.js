import { useState, useCallback } from 'react';


const useSetting = (setting, saveFunction) => {
    
    const [data, setData, loading, error, request] = useFetch('/api/usersettings?setting=' + setting, {onMount: true}, auth, {success: false})
    if(data.length > 1){console.log('Meer dan 1 entry gevonden', data);alert('Meer dan 1 entry gevonden')}
    if(data.length === 1) 
    const [config, handleChange, handleSubmit ] = useForm(saveFunction, {username: '', password: '', success: false});
    
    return [data, setData, loading, error, request, config]
}

const useEnelogic = () => {
    const defaultSetting = {username: '', password: '', success: false}
    const fields = [{name: 'username', label: 'Username'},{name: 'password', label: 'Password', visible:false}]
    const saveEnelogic = () => {
        console.log('hmm');
        alert(config)
    }
    
    const [] = useSetting('enelogic', saveEnelogic)
    
    
    
    
    const [data, setData, loading, error, request] = useFetch('/api/usersettings?setting=enelogic', {onMount: true}, auth, {success: false})
    console.log(1, data, data.length, config)
    if(data.length > 1){console.log('Meer dan 1 entry gevonden', data);alert('Meer dan 1 entry gevonden')}
    if(data.length === 1) 
    const [config, handleChange, handleSubmit ] = useForm(saveEnelogic, {username: '', password: '', success: false});
}
