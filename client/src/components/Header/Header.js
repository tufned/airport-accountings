import React, {useState} from 'react';
import './header.css';

function Header({ mainComponent, setMainComponentHandler }) {
  const [isTablesPopup, setIsTablesPopup] = useState(false);

  const renderTablePage = () => {
    setIsTablesPopup(false);
    setMainComponentHandler('table');
  }

  return (
    <header className={`header-wrapper ${isTablesPopup ? 'active' : ''}`}>
      <div className='header'>
        <div className="header-navbar">
          <div className={`header-item header-tables-item ${isTablesPopup ? 'active' : ''}`}
               onClick={() => setIsTablesPopup(prevState => !prevState)}>
            Tables
          </div>
          <div className={`header-item ${mainComponent === 'about' ? 'active' : ''}`}
               onClick={() => setMainComponentHandler('about')}>
            About
          </div>
        </div>
        <h1>Облік пасажирів в аеропорту</h1>
      </div>
      {isTablesPopup && (
        <div className="tables-popup-container">
          <div className="table-item"
               onClick={renderTablePage}>Passengers</div>
          <div className="table-item"
               onClick={renderTablePage}>Planes</div>
        </div>
      )}
    </header>
  );
}

export default Header;