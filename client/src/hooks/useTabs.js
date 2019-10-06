import { useState, useEffect, useCallback } from 'react';
import queryString from 'query-string';

const useTabs = (initialTab = null) => {
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    //If there is a query param named tab then set that tab
    const tabQuery = queryString.parse(window.location.search).tab;
    if(tabQuery !== undefined){
      setTab(tabQuery);
    }
  }, [])

  const handleTabChange = useCallback((e, newValue) => {
    setTab(newValue)
  })

  return Object.assign([tab, handleTabChange, setTab], { tab, handleTabChange, setTab })
}

export default useTabs;