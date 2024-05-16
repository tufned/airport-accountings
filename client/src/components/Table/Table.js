import React, {useEffect, useRef, useState} from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import './table.css';
import {reqData} from "../../utils/requests";


const columns = [
  { field: 'id', headerName: 'ID', width: 70, sortable: false },
  { field: 'firstName', headerName: 'First name', width: 130, sortable: false },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  { field: 'age', headerName: 'Age', type: 'number', width: 90 },
  { field: 'email', headerName: 'Email', width: 200 },
  { field: 'phone', headerName: 'Phone', width: 150 },
  { field: 'address', headerName: 'Address', width: 200 },
  { field: 'city', headerName: 'City', width: 120 },
  { field: 'state', headerName: 'State', width: 120 },
  { field: 'country', headerName: 'Country', width: 150 },
  { field: 'zipcode', headerName: 'Zip Code', width: 120 },
  { field: 'company', headerName: 'Company', width: 200 },
  { field: 'jobTitle', headerName: 'Job Title', width: 180 },
  { field: 'department', headerName: 'Department', width: 150 },
  { field: 'salary', headerName: 'Salary ($)', type: 'number', width: 120 },
];

const rows = [
  { id: 1, firstName: 'John', lastName: 'Doe', age: 30, email: 'john.doe@example.com', phone: '123-456-7890', address: '123 Main St', city: 'Anytown', state: 'CA', country: 'USA', zipcode: '12345', company: 'ABC Inc', jobTitle: 'Software Engineer', department: 'Engineering', salary: 80000 },
  { id: 2, firstName: 'Jane', lastName: 'Smith', age: 35, email: 'jane.smith@example.com', phone: '987-654-3210', address: '456 Elm St', city: 'Othertown', state: 'NY', country: 'USA', zipcode: '54321', company: 'XYZ Corp', jobTitle: 'Data Analyst', department: 'Analytics', salary: 65000 },
  { id: 3, firstName: 'Jane', lastName: 'Smith', age: 35, email: 'jane.smith@example.com', phone: '987-654-3210', address: '456 Elm St', city: 'Othertown', state: 'NY', country: 'USA', zipcode: '54321', company: 'XYZ Corp', jobTitle: 'Data Analyst', department: 'Analytics', salary: 65000 },
  { id: 4, firstName: 'Jane', lastName: 'Smith', age: 35, email: 'jane.smith@example.com', phone: '987-654-3210', address: '456 Elm St', city: 'Othertown', state: 'NY', country: 'USA', zipcode: '54321', company: 'XYZ Corp', jobTitle: 'Data Analyst', department: 'Analytics', salary: 65000 },
  { id: 5, firstName: 'Jane', lastName: 'Smith', age: 35, email: 'jane.smith@example.com', phone: '987-654-3210', address: '456 Elm St', city: 'Othertown', state: 'NY', country: 'USA', zipcode: '54321', company: 'XYZ Corp', jobTitle: 'Data Analyst', department: 'Analytics', salary: 65000 },
];




function Table({ name }) {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    reqData(`/table/${name}`).then(res => tableSetup(res.data));
  }, [name]);


  function tableSetup(data) {
    const columnsArr = Object.keys(data[0]);

    const columnsObj = columnsArr.map((field) => {
      return {
        field: field,
        headerName: field,
      }
    });

    if (!columnsArr.includes('id')) {
      data.forEach((row, index) => {
        row.id = index;
      });
    }

    setColumns(columnsObj);
    setRows(data);
  }


  return (
    <Box sx={{height: '80vh', width: '100%'}}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          // pagination: {
          //   paginationModel: {
          //     pageSize: 5,
          //   },
          // }
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}

export default Table;