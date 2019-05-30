import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


function useLocalStorage(key, initialValue) {
  //const [userSub, setUserSub] = useState(user);
  const { sub } = useContext(AuthContext);
  
  const userkey = sub + '_' + key;
  
  const saveStoredValue = (key) => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return (item ? JSON.parse(item) : initialValue);
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return (initialValue);
    }
  }
  
  const [storedValue, setStoredValue] = useState(saveStoredValue(userkey));
  
  useEffect(() => {
      setStoredValue(saveStoredValue(userkey));
  }, [sub])
  
  
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = value => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(userkey, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
