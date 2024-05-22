import React, {useEffect, useState} from 'react';
import "./popup.css";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {Button} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {postData, updateData, deleteData} from "../../utils/requests";

function ShowRecordPopup({ record, isCreateMode, popupToggle, tableName, tableComponentReMount }) {
  const [isEditMode, setIsEditMode] = useState(isCreateMode);
  const [error, setError] = useState(null);
  const [resStatus, setResStatus] = useState(null);


  function editModeToggle() {
    setIsEditMode(prevState => !prevState);
    setError(null);
    setResStatus(null);
  }

  const [formData, setFormData] = useState({});
  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const updRecord = {...record};

    if (isCreateMode) {
      for (let key in updRecord) {
        if ((key === "id" && !isNaN(updRecord.id)) || key === "created_at") {
          delete updRecord[key];
          continue;
        }
        updRecord[key] = "";
      }
    }
    setFormData(updRecord);

  }, []);


  function recordRender() {
    return Object.keys(formData).map(key => (
      <div key={`record-item_${key}`} className="record-item">
        <span className="field">{key}: </span>
        {!isEditMode && <span>{formData[key]}</span>}
        {isEditMode && <input name={key} value={formData[key]} onChange={inputChangeHandler} type="text" />}
      </div>
    ));
  }

  useEffect(() => {
    if (resStatus === "success") {
      popupToggle();
      tableComponentReMount();
    }
  }, [error, resStatus]);


  function submitHandler(e) {
    e.preventDefault();

    if (isCreateMode) {
      postData(`/table/${tableName}`, formData)
          .then(res => {
            setResStatus(res.status)
            setError(res.message)
          });
    }
    else {
      updateData(`/table/${tableName}/${formData.id}`, formData)
          .then(res => {
            setResStatus(res.status)
            setError(res.message)
          });
    }
  }

  function deleteRecord() {
    deleteData(`/table/${tableName}/${formData.id}`)
        .then(res => {
          setResStatus(res.status)
          setError(res.message)
        });
  }


  return (
    <div className="popup-wrapper">
      <div className="popup-bg" onClick={popupToggle}></div>

      <div className="popup">
        <div className="popup-header">
          {!isEditMode && <EditIcon onClick={editModeToggle} />}
          {!isCreateMode && (isEditMode ? <CancelIcon onClick={editModeToggle} /> : <DeleteIcon onClick={deleteRecord}/>)}
        </div>

        {resStatus !== null && <div className="error-shell">{error}</div>}

        <form className="record" onSubmit={submitHandler}>
          {recordRender().map(item => item)}
          {isEditMode &&
            <div className="button-wrapper">
              <Button type="submit">
                <span className="">Submit</span>
              </Button>
            </div>
          }
        </form>
      </div>
    </div>
  );
}

export default ShowRecordPopup;