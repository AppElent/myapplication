import { useState, useEffect, useCallback } from 'react';

import {
  useDocument, 
  useDocumentOnce, 
  useDocumentData, 
  useDocumentDataOnce, 
  useCollection, 
  useCollectionOnce, 
  useCollectionData, 
  useCollectionDataOnce} 
  from 'react-firebase-hooks/firestore';

import useSession from './useSession';

const getPath = (path) => {
  console.log('/env/' + process.env.REACT_APP_FIRESTORE_ENVIRONMENT + '/' + path);
  return '/env/' + process.env.REACT_APP_FIRESTORE_ENVIRONMENT + '/' + path;
}

export const useFirestoreDocument = (docpath, options = null) => {
  const {firebase} = useSession();
  docpath = getPath(docpath);
  const [value, loading, error] = useDocument(firebase.db.doc(docpath), options);
  return Object.assign([value, loading, error], { value, loading, error })
};

export const useFirestoreDocumentOnce = (docpath, options = null) => {
  const {firebase} = useSession();
  docpath = getPath(docpath);
  const [value, loading, error] = useDocumentOnce(firebase.db.doc(docpath), options);
  return Object.assign([value, loading, error], { value, loading, error })
};

export const useFirestoreDocumentData = (docpath, options = null) => {
  const {firebase} = useSession();
  docpath = getPath(docpath);
  const [value, loading, error] = useDocumentData(firebase.db.doc(docpath), options);
  return Object.assign([value, loading, error], { value, loading, error })
};

export const useFirestoreCollection = (collpath, options = null) => {
  const {firebase} = useSession();
  collpath = getPath(collpath);
  const [value, loading, error] = useCollection(firebase.db.collection(collpath), options);
  return Object.assign([value, loading, error], { value, loading, error })
};

export const useFirestoreCollectionOnce = (collpath, options = null) => {
  const {firebase} = useSession();
  collpath = getPath(collpath);
  const [value, loading, error] = useCollectionOnce(firebase.db.collection(collpath), options);
  return Object.assign([value, loading, error], { value, loading, error })
};

export const useFirestoreCollectionData = (collpath, options = null) => {
  const {firebase} = useSession();
  collpath = getPath(collpath);
  const [value, loading, error] = useCollectionData(firebase.db.collection(collpath), options);
  return Object.assign([value, loading, error], { value, loading, error })
};

export const useFirestoreDocumentDataOnce = (path) => {
  const {firebase} = useSession();
  path = getPath(path);

  const ref = firebase.db.doc(path);

  const getFirestoreData = useCallback(async () => {
    const fsdata =  await ref.get();
    console.log('Getting firestore data, Path: ' + path, fsdata.data());
    setData(fsdata.data());
  });
  const setFirestoreData = useCallback((fsdata) => {
    ref.set(fsdata);
  });

  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    getFirestoreData()
      .then(setLoading(false))
      .catch(err => {setError(err)});
  }, [])

  return Object.assign([data, loading, error, setFirestoreData], { data, loading, error, setFirestoreData })
}

export const useFirestoreCollectionDataOnce = (path, options = {}) => {
  const {firebase} = useSession();
  path = getPath(path);

  const ref = firebase.db.collection(path);

  const getFirestoreData = useCallback(async () => {
    const fsdata =  await ref.get();
    console.log(options);
    let resultdata;
    if(options.asArray === true){
      resultdata = []
      fsdata.forEach(async doc => {
        resultdata.push(doc.data());
      })
      console.log('Getting firestore data, Path: ' + path, resultdata);
      setData(resultdata);
    }else{
      resultdata = {}
      fsdata.forEach(async doc => {
        resultdata[doc.id] = doc.data();
      })
      console.log('Getting firestore data, Path: ' + path, resultdata);
      setData(resultdata);
    }
    console.log('Getting firestore data, Path: ' + path, resultdata);
    setData(resultdata);
  });
  const setFirestoreData = useCallback((fsdata) => {
    ref.set(fsdata);
  });

  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    getFirestoreData()
      .then(setLoading(false))
      .catch(err => {setError(err)});
  }, [])

  return Object.assign([data, loading, error, setFirestoreData], { data, loading, error, setFirestoreData })
}

