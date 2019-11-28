//import 'idempotent-babel-polyfill' // so async await works ;)
import { useEffect, useState, useCallback } from 'react';
//import {auth} from '../helpers/Firebase';
import { useSession, useCache } from 'hooks';

const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]'


export function useFetch(arg1, arg2) {
  const {user} = useSession();
  const cache = useCache();

  let url = null
  let options = {}
  let onMount = false
  let baseUrl = ''
  let method = 'GET'
  let cacheKey = '';

 
  if (arg2.defaultData === undefined) arg2.defaultData = []

  //console.log('useFetch is called with args ', arg1, arg2);
  const handleOptions = opts => {
    if (true) {
      // take out all the things that are not normal `fetch` options
      // need to take this out of scope so can set the variables below correctly
      let { url, onMount, timeout, baseUrl, ...rest } = opts
      options = rest
    }
    if (opts.url) url = opts.url
    if (opts.onMount) onMount = opts.onMount
    if (opts.method) method = opts.method
    if (opts.baseUrl) baseUrl = opts.baseUrl
    if (opts.cacheKey) cacheKey = opts.cacheKey
  }

  if (typeof arg1 === 'string') {
    url = arg1
    if (isObject(arg2)) handleOptions(arg2)
  } else if (isObject(arg1)) {
    handleOptions(arg1)
  }

  const [data, setData] = useState(arg2.initialData || [])
  const [loading, setLoading] = useState(onMount);
  const [methodLoading, setMethodLoading] = useState(false);
  const [error, setError] = useState(null)

  const fetchData = useCallback(method => async (fArg1, fArg2) => {
    method = method.toLowerCase();
    let newUrl = url;

    const fetchOptions = {}
    if(method === 'post'){
      newUrl = (typeof fArg1 === 'string') ? fArg1 : newUrl;
      fetchOptions.body = (typeof fArg1 === 'string') ? JSON.stringify(fArg2) : JSON.stringify(fArg1);
    }else if(method === 'put' || method === 'patch'){
      newUrl = Number.isInteger(fArg1) ? (url + '/' + fArg1) : (fArg1);
      fetchOptions.body = JSON.stringify(fArg2);
    }else if(method === 'delete'){
      newUrl = Number.isInteger(fArg1) ? (url + '/' + fArg1) : (fArg1);
    }
    
    let responsedata
    try {
      setMethodLoading(true)
      let token = await user.getIdToken(true);
      console.log('Making ' + method + ' request to ' + newUrl);
      var response = await fetch(newUrl, {
        method,
        ...options,
        ...fetchOptions,
        headers: {
          Authorization: 'Firebase ' + token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
      if(!response.ok){
        responsedata = await response.clone().json().catch(() => response.text())
        console.log('error request', responsedata);
        throw (response.status + ' - ' + response.statusText);
      }else{
        responsedata = await response.clone().json().catch(() => response.text())
        console.log('Response data', responsedata);
      }
    } catch (err) {
      console.log('Error with method ' + method + ': ', err, {data: responsedata});
      throw err;
    } finally {
      setMethodLoading(false)
    }
    return responsedata;
  },
  [url]
  )

  const get = async (forceUpdate = false, options = {}) => {
    //
    let query = options.query || '';


    if(!forceUpdate){
      const data = cache.get(cacheKey);
      if(data){
        setData(data);
        if(error) setError(null);
        setLoading(false);
        return;
      }
    }else{
      query = options.query || '?forceUpdate=true';
    }

    const fetchOptions = {}

    let responsedata;
    let realdata = {}
    let fError = {}
    try {
      setLoading(true)
      let token = await user.getIdToken(true);
      console.log('Making GET request to ' + url + query);
      var response = await fetch(url + query, {
        method,
        ...options,
        ...fetchOptions,
        headers: {
          Authorization: 'Firebase ' + token,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
      if(!response.ok){
        responsedata = await response.clone().json().catch(() => response.text())
        console.log('error request', responsedata);
        throw (response.status + ' - ' + response.statusText);
      }else{
        responsedata = await response.clone().json().catch(() => response.text())
        console.log('Response data', responsedata);
        realdata = responsedata.data || responsedata;
        if (arg2.postProcess !== undefined) {realdata = await arg2.postProcess(realdata);}
        setData(realdata)
        cache.set(cacheKey, realdata);
      }

    } catch (err) {
      console.log('error request', err, responsedata)
      fError = err;
      setError({error: err, responsedata})
    } finally {
      setLoading(false)
    }

    return {data: realdata, error: fError}
  }

  //const get = useCallback(fetchData('GET'))
  const post = useCallback(fetchData('POST'))
  const patch = useCallback(fetchData('PATCH'))
  const put = useCallback(fetchData('PUT'))
  const destroy = useCallback(fetchData('DELETE'))

  const request = { get, post, patch, put, destroy }

  useEffect(() => {
    if (onMount) request[method.toLowerCase()]()
  }, [])

  return Object.assign([data, setData, loading, error, request, methodLoading], { data, setData, loading, error, request, ...request, methodLoading })
}

export default useFetch
