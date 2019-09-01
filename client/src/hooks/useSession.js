import { useContext } from 'react';
import {FirebaseContext} from '../context/FirebaseContext';

const useSession = () => useContext(FirebaseContext);

export default useSession;