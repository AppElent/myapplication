// @flow
import React from 'react';


export const CacheContext = React.createContext(null);

export const getCache = (cacheData) => (key) => {
  console.log('Getting value from cache with key ' + key, cacheData);
  return cacheData[key];
}

export const setCache = (setFunction) => (key, data) => {
  setFunction(state => ({ ...state, [key]: data }));
}

export const clearCache = (setFunction) => () => {
  setFunction({})
}

export const clearKey = (setFunction) => (key) => {
  setFunction(state => ({ ...state, [key]: {}}));
}