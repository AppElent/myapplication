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

import { useSession } from 'hooks';

const getPath = (path) => {
  return '/env/' + process.env.REACT_APP_FIRESTORE_ENVIRONMENT + '/' + path;
}

export const useFirestoreDocument = (refpath, options = null) => {
  const {firebase} = useSession();
  let ref;
  if (typeof refpath === 'string') {
    refpath = getPath(refpath);
    ref = firebase.db.doc(refpath)
  }else{
    ref = refpath;
  }
  const [data, loading, error] = useDocument(ref, options);
  return Object.assign([data, loading, error, ref], { data, loading, error, ref })
};

export const useFirestoreDocumentOnce = (refpath, options = null) => {
  const {firebase} = useSession();
  let ref;
  if (typeof refpath === 'string') {
    refpath = getPath(refpath);
    ref = firebase.db.doc(refpath)
  }else{
    ref = refpath;
  }
  const [data, loading, error] = useDocumentOnce(ref, options);
  return Object.assign([data, loading, error, ref], { data, loading, error, ref })
};

export const useFirestoreDocumentData = (refpath, options = null) => {
  const {firebase} = useSession();
  let ref;
  if (typeof refpath === 'string') {
    refpath = getPath(refpath);
    ref = firebase.db.doc(refpath)
  }else{
    ref = refpath;
  }
  const [data, loading, error] = useDocumentData(ref, options);
  return Object.assign([data, loading, error, ref], { data, loading, error, ref })
};

export const useFirestoreDocumentDataOnce = (refpath, options = null) => {
  const {firebase} = useSession();
  let ref;
  if (typeof refpath === 'string') {
    refpath = getPath(refpath);
    ref = firebase.db.doc(refpath)
  }else{
    ref = refpath;
  }
  const [data, loading, error] = useDocumentDataOnce(ref, options);
  return Object.assign([data, loading, error, ref], { data, loading, error, ref })
}

export const useFirestoreCollection = (refpath, options = null) => {
  const {firebase} = useSession();
  let ref;
  if (typeof refpath === 'string') {
    refpath = getPath(refpath);
    ref = firebase.db.collection(refpath)
  }else{
    ref = refpath;
  }
  const [data, loading, error] = useCollection(ref, options);
  return Object.assign([data, loading, error, ref], { data, loading, error, ref })
};

export const useFirestoreCollectionOnce = (refpath, options = null) => {
  const {firebase} = useSession();
  let ref;
  if (typeof refpath === 'string') {
    refpath = getPath(refpath);
    ref = firebase.db.collection(refpath)
  }else{
    ref = refpath;
  }
  const [data, loading, error] = useCollectionOnce(ref, options);
  return Object.assign([data, loading, error, ref], { data, loading, error, ref })
};

export const useFirestoreCollectionData = (refpath, options = null) => {
  const {firebase} = useSession();
  let ref;
  if (typeof refpath === 'string') {
    refpath = getPath(refpath);
    ref = firebase.db.collection(refpath)
  }else{
    ref = refpath;
  }
  const [data, loading, error] = useCollectionData(ref, options);
  return Object.assign([data, loading, error, ref], { data, loading, error, ref })
};

export const useFirestoreCollectionDataOnce = (refpath, options = null) => {
  const {firebase} = useSession();
  let ref;
  if (typeof refpath === 'string') {
    refpath = getPath(refpath);
    ref = firebase.db.collection(refpath)
  }else{
    ref = refpath;
  }
  const [data, loading, error] = useCollectionDataOnce(ref, options);
  return Object.assign([data, loading, error, ref], { data, loading, error, ref })
};

/*
export const useFirestoreDocumentDataOnce = (refpath) => {
  const {firebase} = useSession();
  let ref;
  if (typeof refpath === 'string') {
    refpath = getPath(refpath);
    ref = firebase.db.doc(refpath)
  }else{
    ref = refpath;
  }

  const getFirestoreData = useCallback(async () => {
    const fsdata =  await ref.get();
    console.log('Getting firestore data, Path: ' + refpath, fsdata.data());
    setData(fsdata.data());
  });

  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    getFirestoreData()
      .then(setLoading(false))
      .catch(err => {setError(err)});
  }, [])

  return Object.assign([data, loading, error, ref], { data, loading, error, ref })
}


export const useFirestoreCollectionDataOnce = (path, options = {}) => {
  const {firebase} = useSession();
  path = getPath(path);

  const ref = firebase.db.collection(path);

  const getFirestoreData = useCallback(async () => {
    const fsdata =  await ref.get();
    let resultdata;
    if(options.asArray === true){
      resultdata = []
      fsdata.forEach(async doc => {
        resultdata.push(doc.data());
      })
      console.log('Getting firestore data, Path: ' + path, resultdata);
    }else{
      resultdata = {}
      fsdata.forEach(async doc => {
        resultdata[doc.id] = doc.data();
      })
      console.log('Getting firestore data, Path: ' + path, resultdata);
    }
    setdata(resultdata);
  });

  const [data, setdata] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    getFirestoreData()
      .then(setLoading(false))
      .catch(err => {setError(err)});
  }, [])

  return Object.assign([data, loading, error, ref], { data, loading, error, ref })
}
*/
