import { useState, FormEvent, ChangeEvent } from "react";

import auth from '../utils/auth';
import { login } from "../api/authAPI";
import { useNavigate, useOutletContext } from "react-router-dom";
import LoginProps from "../interfaces/LoginProps";

const Login = () => {
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const {setLoggedIn}: LoginProps = useOutletContext();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(loginData);
      auth.login(data.token);
      setLoggedIn(true);
      navigate('/');
    } catch (err) {
      setErrorMessage('Credentials are incorrect.');
      console.error('Failed to login', err);
    }
  };

  return (
    <div className='container'>
      <form className='form' onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label >Username</label>
        <input 
          type='text'
          name='username'
          value={loginData.username || ''}
          onChange={handleChange}
        />
      <label>Password</label>
        <input 
          type='password'
          name='password'
          value={loginData.password || ''}
          onChange={handleChange}
        />
        <p className="error">{errorMessage}</p>
        <button type='submit'>Submit Form</button>
      </form>
    </div>
    
  )
};

export default Login;
