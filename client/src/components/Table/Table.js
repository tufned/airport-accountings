import React, {useEffect, useRef, useState} from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import './table.css';
import {postData, reqData} from "../../utils/requests";
import ShowRecordPopup from "../ShowRecordPopup/ShowRecordPopup";
import AddIcon from '@mui/icons-material/Add';
import {Button} from "@mui/material";
import moment from "moment";



function Table({ name, tableComponentReMount }) {
  const [tableData, setTableData] = useState();
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    reqData(`/table/${name}`).then(res => {
      setTableData(res.data);
      tableSetup(res.data);
    });
  }, [name]);


  function tableSetup(data) {
    const columnsArr = Object.keys(data[0]);
    console.log(data);

    const columnsObj = columnsArr.map((field) => {
      return {
        field: field,
        headerName: field,
      }
    });

    data.forEach((row, index) => {
      if (!row.id) row.id = index;
      if (row.created_at) {
        let date = new Date(row.created_at);
        row.created_at = moment(date).format('YYYY-MM-DD hh:mm:ss');
      }
    });

    setColumns(columnsObj);
    setRows(data);
  }

  const [showRecordPopupData, setShowRecordPopupData] = useState(null);
  function showRecordPopupToggle(isCreateMode, params) {
    if (showRecordPopupData === null) setShowRecordPopupData({
      data: params,
      isCreateMode: isCreateMode
    });
    else setShowRecordPopupData(null);
  }


  return (
    <Box sx={{height: '80vh', width: '100%'}}>
      <div className="table-header-wrapper">
        <h2>{name}</h2>
        <Button onClick={() => showRecordPopupToggle(true, tableData[0])}>
          <AddIcon/>
          <span className="">Add record</span>
        </Button>
      </div>

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
        // checkboxSelection
        disableRowSelectionOnClick
        onRowClick={(params) => showRecordPopupToggle(false, params.row)}
      />

      {showRecordPopupData !== null &&
          <ShowRecordPopup record={showRecordPopupData.data}
                           isCreateMode={showRecordPopupData.isCreateMode}
                           popupToggle={showRecordPopupToggle}
                           tableName={name}
                           tableComponentReMount={tableComponentReMount} />}
    </Box>
  );
}

export default Table;