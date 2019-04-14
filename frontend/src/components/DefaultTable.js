import React from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css';

const DefaultTable = ({data, columns, loading=false, pageSize=15}) => {
    
    
    function getTotal (array, column) {
        let total = 0
        if(array.length > 0){
            for (let line of array) {
              total += line[column]
            }
            return (<div>{total}</div>);
        }
    }
    console.log(pageSize);
    
    return <div>
    <ReactTable
        data={data}
        columns={columns}
        className='-highlight -striped'
        defaultPageSize={pageSize}
        filterable={true}
        loading={loading}
    />
    </div>
        

    
}

export default DefaultTable
