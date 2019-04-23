

const encryptionkey = 'abcdefg';
const localstoragekey = 'myapplication_storage'


export const getLocalStorage = (key) => {
  let data = localStorage.getItem(localstoragekey);
  if(data === null){
      return null;
  }
  data = JSON.parse(data);
  if(data[key] === undefined){
      return null;
  }
  return data[key]
      
}

export const setLocalStorage = (key, data) => {
  let object = localStorage.getItem(localstoragekey);
  if(object === null){
      object = {[key]: data}
  }else{
      object = JSON.parse(object);
      object[key] = data;
  }
  localStorage.setItem(localstoragekey, JSON.stringify(object));
}

