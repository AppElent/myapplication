exports.getDifferenceArray = (array, id, columnArray) => {
    const savedItems = {};
    //savedItems['first'] = array[0];
    savedItems['previous'] = array[0];
    for (var item of array) {
        const index = array.findIndex(e => e[id] === item[id]);
        for (const column of columnArray) {
            if (column in savedItems) {
            }
            const difference = item[column] - savedItems['previous'][column];

            array[index][column + '_diff'] = difference;
        }
        savedItems['previous'] = item;
    }
    return array;
};
