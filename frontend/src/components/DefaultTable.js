import React from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css';

const DefaultTable = ({data, columns, loading=false, pageSize=15}) => {
    
    
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
