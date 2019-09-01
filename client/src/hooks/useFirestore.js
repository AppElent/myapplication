import { useState, useEffect } from 'react';

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

export const useFirestoreDocumentDataOnce = (docpath, options = null) => {
  const {firebase} = useSession();
  docpath = getPath(docpath);
  const [value, loading, error] = useDocumentDataOnce(firebase.db.doc(docpath), options);
  return Object.assign([value, loading, error], { value, loading, error })
};

export const useFirestoreCollection = (collpath, options = null) => {
  const {firebase} = useSession();
  collpath = getPath(collpath);
  const [value, loading, error] = useCollection(firebase.db.doc(collpath), options);
  return Object.assign([value, loading, error], { value, loading, error })
};

export const useFirestoreCollectionOnce = (collpath, options = null) => {
  const {firebase} = useSession();
  collpath = getPath(collpath);
  const [value, loading, error] = useCollectionOnce(firebase.db.doc(collpath), options);
  return Object.assign([value, loading, error], { value, loading, error })
};

export const useFirestoreCollectionData = (collpath, options = null) => {
  const {firebase} = useSession();
  collpath = getPath(collpath);
  const [value, loading, error] = useCollectionData(firebase.db.doc(collpath), options);
  return Object.assign([value, loading, error], { value, loading, error })
};

export const useFirestoreCollectionDataOnce = (collpath, options = null) => {
  const {firebase} = useSession();
  collpath = getPath(collpath);
  const [value, loading, error] = useCollectionDataOnce(firebase.db.doc(collpath), options);
  return Object.assign([value, loading, error], { value, loading, error })
};

