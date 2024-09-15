
import './App.css';
import React, {useState, useRef, useEffect} from 'react'
import TopToolBar from './components/TopToolBar/TopToolBar';
import LeftToolBar from './components/LeftToolBar/LeftToolBar';
import Chart from './components/Chart/Chart';
import StockDataBar from './components/StockDataBar/StockDataBar';

function App() {

  const [ticker, setTicker] = useState("GME")

  const handleTickerChange = (e) => {
    if(e.key === 'Enter')
      setTicker(e.target.value)
  }

  return (
    <div className="App">
      <div className="TopPanel">
        <TopToolBar ticker = {ticker} handleTickerChange = {handleTickerChange} />
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
