import './StockDataBar.css';
import React, {useEffect} from 'react'

function StockDataBar({ticker}) {

  const stockUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${ticker}`
const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(stockUrl);

async function getStock() {
  const reponse = await fetch(proxyUrl)
  return reponse.json()
}

  useEffect(() => {
    getStock().then((data) => {
      console.log(data)
    })
  })

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
  