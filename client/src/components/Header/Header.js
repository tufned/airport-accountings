import React, {useEffect, useRef, useState} from 'react';
import './header.css';
import { reqData } from '../../utils/requests';

function Header({ mainComponent, setMainComponentHandler, setTableNameHandler, tableName }) {
  const [isTablesPopup, setIsTablesPopup] = useState(false);
  const [tables, setTables] = useState([]);

  const renderTablePage = (e) => {
    setTableNameHandler(e.target.id);
    setMainComponentHandler('table');

    setIsTablesPopup(false);
  }

  const isExecuteOnMount = useRef(true);
  useEffect(() => {
    if (!isExecuteOnMount.current) return;
    isExecuteOnMount.current = false;

    reqData('/table/all').then((res) => setTables(res.data))
  }, []);


  const resetTablesHandler = () => reqData(`/reset`).then(res => {
      if (res.status === "success") window.location.reload();
    });



  return (
    <header className={`header-wrapper ${isTablesPopup ? 'active' : ''}`}>
      <div className='header'>
        <div className="header-navbar">
          <div className={`header-item header-tables-item ${isTablesPopup ? 'active' : ''}`}
               onClick={() => setIsTablesPopup(prevState => !prevState)}>
            Tables
          </div>
          <div className={`header-item ${mainComponent === 'about' ? 'active' : ''}`}
               onClick={() => {
                 setTableNameHandler(null);
                 setMainComponentHandler('about');
               }}>
            About
          </div>
          <div className={`header-item reset-but ${mainComponent === 'about' ? 'active' : ''}`} onDoubleClick={resetTablesHandler}>
            Reset Tables Data (double click)
          </div>
        </div>
        <h1>Облік пасажирів в аеропорту</h1>
      </div>
      {isTablesPopup && (
        <div className="tables-popup-container">
          {tables.map(table => (
            <div id={table} key={table} className={`table-item ${tableName === table ? 'active' : ''}`} onClick={renderTablePage}>{table}</div>
          ))}
        </div>
      )}
    </header>
  );
}

export default Header;