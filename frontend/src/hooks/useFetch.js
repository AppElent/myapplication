//import 'idempotent-babel-polyfill' // so async await works ;)
import { useEffect, useState, useCallback } from 'react'

const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]'

export function useFetch(arg1, arg2) {
  let url = null
  let options = {}
  let onMount = false
  let baseUrl = ''
  let method = 'GET'
  
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
  }

  if (typeof arg1 === 'string') {
    url = arg1
    if (isObject(arg2)) handleOptions(arg2)
  } else if (isObject(arg1)) {
    handleOptions(arg1)
  }

  const [data, setData] = useState(arg2.defaultData)
  const [loading, setLoading] = useState(onMount)
  const [error, setError] = useState(null)

  const fetchData = useCallback(method => async (fArg1, fArg2) => {
      let query = ''
      
      const fetchOptions = {}
      if (isObject(fArg1) && method.toLowerCase() !== 'get') {
        fetchOptions.body = JSON.stringify(fArg1)
      } else if (baseUrl && typeof fArg1 === 'string') {
        url = baseUrl + fArg1
        if (isObject(fArg2)) fetchOptions.body = JSON.stringify(fArg2)
      } else if ( typeof fArg1 === 'string'){
        url = fArg1
        if (isObject(fArg2)) fetchOptions.body = JSON.stringify(fArg2)
      }
      if (typeof fArg1 === 'string' && typeof fArg2 === 'string') query = fArg2
      
      try {
        setLoading(true)
        let token = await arg2.auth.getAccessToken();
        console.log('Making ' + method + ' request to ' + url + query);
        var response = await fetch(url + query, {
          method,
          ...options,
          ...fetchOptions,
          headers: {
             Authorization: 'Bearer ' + token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        })
        console.log(response);
        if(!response.ok){
          console.log("error request");
          throw (response.status + ' - ' + response.statusText);
        }else{
          let responsedata = null;
          try {
            responsedata = await response.json()
          } catch (err) {
            responsedata = await response.text()
          }
          if(method.toLowerCase() === 'get'){
            if (arg2.postProcess !== undefined) {responsedata = await arg2.postProcess(responsedata);}else{console.log(12345)}
            setData(responsedata)
          }
        }

      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    },
    [url]
  )

  const get = useCallback(fetchData('GET'))
  const post = useCallback(fetchData('POST'))
  const patch = useCallback(fetchData('PATCH'))
  const put = useCallback(fetchData('PUT'))
  const del = useCallback(fetchData('DELETE'))

  const request = { get, post, patch, put, del, delete: del }

  useEffect(() => {
    if (onMount) request[method.toLowerCase()]()
  }, [])

  return Object.assign([data, setData, loading, error, request], { data, setData, loading, error, request, ...request })
}

export default useFetch
