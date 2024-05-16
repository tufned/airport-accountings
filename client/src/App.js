import logo from './logo.svg';
import './App.css';
import Table from './components/Table/Table';
import Header from "./components/Header/Header";
import {useEffect, useState} from "react";
import About from "./components/About/About";

function App() {
  const [mainComponent, setMainComponent] = useState('about');
  // const [mainComponent, setMainComponent] = useState('table');
  const setMainComponentHandler = (componentName) => {
    setMainComponent(componentName);
  }

  const [tableName, setTableName] = useState(null);
  // const [tableName, setTableName] = useState('passengers');
  const setTableNameHandler = (name) => {
    setTableName(name);
  }

  return (
    <>
      <Header
        mainComponent={mainComponent}
        setMainComponentHandler={setMainComponentHandler}
        setTableNameHandler={setTableNameHandler}
        tableName={tableName}
      />
      <main>
        {mainComponent === 'about' && <About/>}
        {mainComponent === 'table' && <Table name={tableName} />}
      </main>
    </>
  );
}

export default App;
