import React, { useState } from "react";
import axios from 'axios'
import "./LoginModal.css";

export default function LoginModal({handleIsLoggedIn}) {

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "", // Only relevant for signup
      });
    
    const [isSignUp, setIsSignUp] = useState(true) // Toggle between Sign Up and Login
    
    const [modal, setModal] = useState(true) // Toggle modal visibility

    const [signUpMessage, setSignUpMessage] = useState('')

    const [loginMessage, setLoginMessage] = useState('')
    
    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Toggle modal visibility
    const toggleModal = () => setModal(!modal);
    
    // Toggle between Sign Up and Login
    const toggleSignUp = () => setIsSignUp(!isSignUp);

    // Handle form submit
    const handleFormSubmit = async (e) => {

        e.preventDefault(); // Prevent default form submission

        // sign up
        if(isSignUp) {

            // You can add further validation or API calls here
            if (formData.password !== formData.confirmPassword) {
                console.log("Passwords do not match!");
                setSignUpMessage('Password Do Not Match.')
                return;
            } 

            try {
                const response = await axios.post('http://3.21.231.100:3001/createUser', formData)
                if(response.status === 201) {
                    console.log(response.status)
                    setSignUpMessage('User created successfully. Proceed to login.')
                    
                }
                else if (response.status === 202) {
                    setSignUpMessage('Username is taken.')
                }
                else {
                    setSignUpMessage("Something went wrong.")
                }
            }
            catch {
                console.log('Something went wrong with sign up.')
            }
        
        }

        else {
            var reRender = false
            try {
                const response = await axios.post('http://3.21.231.100:3001/login', formData)
                console.log(response.status)
                if(response.status === 201) {
                    const id = response.data.user_id
                    console.log(id)
                    console.log('success')
                    toggleModal()
                    handleIsLoggedIn(id)
                    console.log('success')
                    
                }
                else {
                    if(response.status === 202) {
                        setLoginMessage("Username/password incorrect.")
                    }
                    else {
                        setSignUpMessage('Something went wrong.')
                    }
                }
            }
            catch (err) {
                console.log(err)
                
                
            }   

        }

        // Process the form data (e.g., send to API)

        
    };
    
    
    return (
    <>
        {/* <button onClick={toggleModal} className="btn-modal">
        Open
        </button> */}
    
        {modal && (
        <div className="modal">
            <div onClick={toggleModal} className="overlay"></div>
            <div className="modal-content">
            <h2></h2>
    
            <form onSubmit={handleFormSubmit}>
                  {isSignUp ? (
                    <>
                      <h1>Sign Up</h1>
                      <div className="ui divider"></div>
                      <div className="ui form">
                        <div className="field">
                          <label>Username</label>
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                          />
                        </div>
    
                        <div className="field">
                          <label>Password</label>
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                          />
                        </div>
    
                        <div className="field">
                          <label>Confirm Password</label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm password"
                          />
                        </div>
                        <button type="submit" className="fluid ui button blue">
                          Create Account
                        </button>
                        <p>{signUpMessage}</p>
                        <a onClick={toggleSignUp}>
                        Have an account? Sign in here.
                        </a>

                      </div>
                    </>
                  ) : (
                    <>
                      <h1>Login</h1>
                      <div className="ui divider"></div>
                      <div className="ui form">
                        <div className="field">
                          <label>Username</label>
                          <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                          />
                        </div>
    
                        <div className="field">
                          <label>Password</label>
                          <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                          />
                        </div>

                        <button type="submit" className="fluid ui button blue"> 
                          Login
                        </button>
                        <p>{loginMessage}</p>
                        <a onClick={toggleSignUp}>
                        New? Create account here.
                        </a>

                      </div>
                    </>
                  )}
                </form>
    
                <button className="close-modal" onClick={() => {toggleModal(); handleIsLoggedIn();}}>
                  CLOSE
                </button>
              </div>
            </div>
          )}
        </>
      );
    }
