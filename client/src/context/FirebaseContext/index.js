// @flow
import React, { useContext } from 'react';
import Firebase from 'modules/Firebase';


export const FirebaseContext = React.createContext(null);

export const useSession = () => useContext(FirebaseContext);

export default Firebase;
