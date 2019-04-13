import React from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css';

const DefaultTable = ({data, columns, loading=false}) => {
    
    
    function getTotal (array, column) {
        let total = 0
        if(array.length > 0){
            for (let line of array) {
              total += line[column]
            }
            return (<div>{total}</div>);
        }
    }

    
    return <div>
    <ReactTable
        data={data}
        columns={columns}
        className='-highlight -striped'
        defaultPageSize={17}
        filterable={true}
        loading={loading}
    />
    </div>
        

    
}

export default DefaultTable
