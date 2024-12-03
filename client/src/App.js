
import './App.css';
import React, {useState} from 'react'
import LoginModal from './components/LoginModal/LoginModal'
import NavBar from './components/NavBar/NavBar'
import TradingChart from './components/TradingChart/TradingChart'


function App() {

  const [user_id, setUserId] = useState(-1)
  const [stock_id, setStock_Id] = useState(1)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleIsLoggedIn = (id = 1) => {
    console.log('log in toggled')
    setIsLoggedIn(!isLoggedIn)
    setUserId(id)
  }

  return (
    <div className="App">
      <div className = 'login-overlay'>
        
        {isLoggedIn ? (<div><p></p>
          <TradingChart stock_id = {stock_id} user_id = {user_id}></TradingChart>
          </div>) : (<LoginModal handleIsLoggedIn = {handleIsLoggedIn}></LoginModal>)}
        
      </div>
      <div className = "main">
          <NavBar></NavBar>
        </div>
    </div>
  );
}

export default App;
