import React from 'react';


const editableCell = (data, onChange) => (cellInfo) => {
	//console.log(cellInfo, abc)
	return (
	  <div
		contentEditable
		suppressContentEditableWarning
		onBlur={async (e) => {
		  const newdata = [...data];
		  let newValue = e.target.innerHTML;
		  if(Number.isInteger(data[cellInfo.index][cellInfo.column.id])){
			  newValue = parseInt(newValue);
		  }
		  if(newValue !== newdata[cellInfo.index][cellInfo.column.id]){
			  newdata[cellInfo.index][cellInfo.column.id] = newValue;
			  let toChangeItem = {[cellInfo.column.id]: newValue}
			  console.log('/api/rekeningen/' + newdata[cellInfo.index].id, toChangeItem);
			  await onChange(cellInfo, toChangeItem);//request.put('/api/rekeningen/' + newdata[cellInfo.index].id, toChangeItem);
		  }
		}}
		dangerouslySetInnerHTML={{
		  __html: data[cellInfo.index][cellInfo.column.id]
		}}
	  />
	);
};

export default editableCell;
