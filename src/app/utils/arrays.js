



exports.getDifferenceArray = (array, id, columnArray) => {
	var savedItems = {}
	//savedItems['first'] = array[0];
	savedItems['previous'] = array[0];
	for(var item of array){
		let index = array.findIndex((e) => e[id] === item[id]);
		for(var column of columnArray){
			if(column in savedItems){
				
			}
			let difference = item[column]-savedItems['previous'][column];
			
			array[index][column + '_diff'] = difference;
			
		}
		savedItems['previous'] = item;
	}
	return array;
}
