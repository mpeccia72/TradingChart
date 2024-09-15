import './StockDataBar.css';

function StockDataBar({ticker}) {

    return (
      <div className="DataBar">
        <div className = "Stock">
          <div>{ticker}</div>
          <div className = "Price">
        $23.07
        </div>

        </div>
        <p>
          StockDataBar
        </p>
      </div>
    );
  }

  
export default StockDataBar;
  