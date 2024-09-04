
import './App.css';
import TopToolBar from './components/TopToolBar/TopToolBar';
import LeftToolBar from './components/LeftToolBar/LeftToolBar';
import Chart from './components/Chart/Chart';
import StockDataBar from './components/StockDataBar/StockDataBar';

function App() {
  return (
    <div className="App">
      <div className="TopPanel">
        <TopToolBar/>
      </div>
      <div className="BottomPanel">
        <LeftToolBar/>
        <Chart/>
        <StockDataBar/>
      </div>
      
      
    </div>
  );
}

export default App;
