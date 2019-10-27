import { useContext } from 'react';
import {CacheContext} from '../context/CacheContext';

const useCache = () => useContext(CacheContext);

export default useCache;