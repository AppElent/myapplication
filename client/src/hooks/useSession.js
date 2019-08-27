import { useContext } from 'react';
import {FirebaseContext} from '../context/FirebaseContext';

/*
const useSession = () => {
  const firebase = useContext(FirebaseContext);
  return firebase;
}
*/

const useSession = () => useContext(FirebaseContext);

export default useSession;