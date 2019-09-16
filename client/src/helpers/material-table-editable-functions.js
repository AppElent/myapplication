
export const addData = (ref, prop) => async (data) => {
  console.log(data);
  await ref.doc(data[prop]).set(data);
}

export const updateData = (ref, prop) => async (data) => {
  console.log(data);
  await ref.doc(data[prop]).set(data);
}

export const deleteData = (ref, prop) => async (data) => {
  console.log(data);
  await ref.doc(data[prop]).delete();
}

