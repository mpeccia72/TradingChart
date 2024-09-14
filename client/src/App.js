
import './App.css';
import React, {useState, useRef, useEffect} from 'react'
import TopToolBar from './components/TopToolBar/TopToolBar';
import LeftToolBar from './components/LeftToolBar/LeftToolBar';
import Chart from './components/Chart/Chart';
import StockDataBar from './components/StockDataBar/StockDataBar';

function App() {

  const [ticker, setTicker] = useState("")

  // callback function to pass stock ticker selected to parent component
  const handleDataFromChild = (newTicker) => {
    setTicker(newTicker)
  }

  return (
    <div className="App">
      <div className="TopPanel">
        <TopToolBar onTickerChange = {handleDataFromChild} />
      </div>
      <div className="BottomPanel">
        <LeftToolBar/>
        <Chart ticker = {ticker}/>
        <StockDataBar ticker = {ticker}/>
      </div>
      
      
    </div>
  );
}

export default App;
