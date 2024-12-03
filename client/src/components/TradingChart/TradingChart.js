import { useEffect, useState, useMemo } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios'


function TradingChart({user_id}) {

  const dataUrl = 'http://localhost:3001/getData';
  
  const [data, setData] = useState([]); // State to store the fetched data

  const [search, setSearch] = useState('')

  const [company, setCompany] = useState('')

  const [ticker, setTicker] = useState('')

  const [popular, setPopular] = useState('')

  const [quantity, setQuantity] = useState('')

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      const searchValue = e.target.value
       // Save the input value to 'search' when Enter is pressed
      e.target.value = ''
      try {
        console.log(`user id is ${user_id} and search value is ${searchValue}`)
        const response = await axios.post('http://localhost:3001/setStock', {"user_id": user_id, "ticker": searchValue })
        setSearch(searchValue)
        
        console.log(response.data)
      }
      catch (err) {
        console.log(err)
      }
      
    }
  };

  const getCompanyData = async(id) => {
    const response = await axios.post('http://localhost:3001/getCompanyDatak', {"user_id": id})
  }

  

  // Fetch the data from the API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const body = {
          "user_id": user_id
        }
        console.log(`user id is from working ${user_id}`)
        const response = await axios.post(dataUrl, body); // Make the POST request
        setData(response.data); // Assuming the response is the array of stock data
        const response2 = await axios.post('http://localhost:3001/getCompanyData', body)
        setCompany(response2.data.name)
        setTicker(response2.data.ticker)
        const response3 = await axios.get('http://localhost:3001/mostPopular')
        setPopular(response3.data.ticker)
        setQuantity(response3.data.quantity)
        console.log(response3.data.ticker)
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, [search]); // Empty dependency array to run once when the component mounts

  return (
    <div>
      <p>
  Most popular stock right now is 
  <span style={{ fontWeight: 'bold', color: '#00FF00', marginRight: '4px' , marginLeft: '4px'
  }}>{popular}</span> 
  with 
  <span style={{ fontWeight: 'bold', color: '#ff5733', marginRight: '4px', marginLeft: '4px' }}>{quantity}</span> 
  users watching
</p>
      <h1>Stock Data for {company} (${ticker})</h1>
      <input type = "text"  onKeyDown = {handleKeyPress} placeholder = "Search ticker"></input>

      {data.map((item, index) => (
        <div key={index}> 
          <p>Timestamp: {item.timestamp}  Open: {item.open}   High: {item.high}   Low: {item.close}   Close: {item.close}</p>
        </div> 
      ))}

      <div> <p style = {{fontWeight: 'bold'}}>Your user_id is {user_id}</p></div>
    </div>
  )
}

export default TradingChart;