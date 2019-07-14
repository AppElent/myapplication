import { useState, useCallback } from 'react';

const useStateExtended = (initialValue, initialLoading = false) => {
  
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(initialLoading);
  
  return Object.assign([data, setData, loading, setLoading], { data, setData, loading, setLoading })
};

export default useStateExtended;

