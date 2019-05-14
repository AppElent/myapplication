import { useState, useEffect } from 'react';


function useLocalStorage(user, key, initialValue) {
  const [userSub, setUserSub] = useState(user);
  
  if (user !== userSub) setUserSub(user);
  
  const userkey = userSub + '_' + key;
  
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
  
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  
  const [storedValue, setStoredValue] = useState(saveStoredValue(userkey));
  
  console.log(userSub, storedValue)
  
  useEffect(() => {
      setStoredValue(saveStoredValue(userkey));
  }, [userSub])
  
  
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = value => {
    console.log('setting value ' + value)
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
