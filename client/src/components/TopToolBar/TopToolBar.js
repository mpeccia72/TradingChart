import './TopToolBar.css';
import React, {useState} from 'react'

function TopToolBar() {

    // user is logged out by default
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const handleLogin = () => {
      setIsLoggedIn(true)
    }

    const handleChange = () => {

    }

    return (
      <div className="Taskbar">
        <div className = "SearchIcon">
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
  