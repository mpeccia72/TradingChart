import './TopToolBar.css';
import React, {useState} from 'react'

function TopToolBar({ticker, handleTickerChange}) {

    // user is logged out by default
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const handleLogin = () => {
      setIsLoggedIn(true)
    }

    const [searchQuery, setSearchQuery] = useState("")

    const handleSearchQuery = (e) => {
      setSearchQuery(e.target.value)
    }

    return (
      <div className="Taskbar">
        <div className = "SearchIcon">
          <input type = "text" value = {searchQuery} onChange = {(handleSearchQuery)} onKeyDown = {handleTickerChange} ></input>
          Search
        </div>
        <div className = "Indicator">
          Add
          Indicator
        </div>
        <div className="EmptyFiller"></div>
        <div className = "Login">
          Login
        </div>
        
      </div>
    );
  }
  
export default TopToolBar;
  