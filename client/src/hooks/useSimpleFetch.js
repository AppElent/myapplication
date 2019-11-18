//import 'idempotent-babel-polyfill' // so async await works ;)
import { useState, useCallback } from 'react';
//import {auth} from '../helpers/Firebase';
import { useSession } from 'hooks';
import { fetchBackend } from 'helpers';

//const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]'

export function useSimpleFetch(url, options = {}) {
  const { user } = useSession();
  const [loading, setLoading] = useState(false);
  
    //default options zetten
  if(!options.method) options.method = 'GET';
  options.user = user;

  const execute = async () => {
    setLoading(true);
    const result = await fetchBackend(url, options);
    setLoading(false);
    return result;
  }


  return Object.assign([loading, execute], { loading, execute })
}

export default useSimpleFetch
