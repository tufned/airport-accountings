import logo from './logo.svg';
import './App.css';
import Table from './components/Table/Table';
import Header from "./components/Header/Header";
import {useEffect, useState} from "react";
import About from "./components/About/About";

function App() {
  const [mainComponent, setMainComponent] = useState('about');
  const setMainComponentHandler = (componentName) => {
    setMainComponent(componentName);
  }

  useEffect(() => console.log(mainComponent), [mainComponent]);

  return (
    <>
      <Header
        mainComponent={mainComponent}
        setMainComponentHandler={setMainComponentHandler} />
      <main>
        {mainComponent === 'about' && <About/>}
        {mainComponent === 'table' && <Table/>}
      </main>
    </>
  );
}

export default App;
