import React, { useState } from 'react';
import logo from "../config/image/logo1.png";
import side from "../config/image/side.png";
import axios from 'axios';
import { TextField, Button, InputAdornment, IconButton, FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import config from '../config/ServiceApi';

const LoginPage = () => {
  const [userData, setUserData] = useState({
    userEmail: '',
    userPass: '',
  });

  const [hidePassword, setHidePassword] = useState(true);
  const [errors, setErrors] = useState({
    userEmail: '',
    userPass: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
    validateForm();  
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { userEmail: '', userPass: '' };

  
    if (!userData.userEmail) {
      newErrors.userEmail = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(userData.userEmail)) {
      newErrors.userEmail = 'Please enter a valid email';
      valid = false;
    }

  
    if (!userData.userPass) {
      newErrors.userPass = 'Password is required';
      valid = false;
    } else if (userData.userPass.length < 4) {
      newErrors.userPass = 'Password must be at least 8 characters';
      valid = false;
    // } else if (!/[A-Za-z]/.test(userData.userPass) || !/[0-9]/.test(userData.userPass)) {
    //   newErrors.userPass = 'Password must contain at least one letter and one number';
    //   valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post(`${config.baseURL}${config.authLogin}`, {
          email: userData.userEmail,
          password: userData.userPass,
        });

        if (response.status === 200) {
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('role', response.data.role);
          window.location.href = '/dashboard';
        }
      } catch (error) {
        alert('Login failed. Please check your credentials.');
        console.error('Login error:', error);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
  };

  return (
    <div className='body1'>
      <div className="login-page-container">
     
        <div className="login-left-section">
          <div className="logo-container">
            <img src={side} alt="side" className="side" />
            <img src={logo} alt="Logo" className="logo" />
            <h1 className="app-title">RentGuard</h1>
          </div>
        </div>
        <div className="login-right-section">
          <div className="login-form-container">
            <h2 className="login-title">Log In </h2>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <TextField
                  label="Your Email"
                  variant="outlined"
                  fullWidth
                  name="userEmail"
                  value={userData.userEmail}
                  onChange={handleInputChange}
                  error={!!errors.userEmail}
                  helperText={errors.userEmail}
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <FormControl variant="outlined" fullWidth error={!!errors.userPass}>
                  <InputLabel htmlFor="userPass">Your Password</InputLabel>
                  <OutlinedInput
                    id="userPass"
                    name="userPass"
                    type={hidePassword ? 'password' : 'text'}
                    value={userData.userPass}
                    onChange={handleInputChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility} edge="end">
                          {hidePassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Your Password"
                    placeholder="Enter your password"
                  />
                </FormControl>
                {errors.userPass && <small className="error-text">{errors.userPass}</small>}
              </div>

              <div className="form-group">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={!!errors.userEmail || !!errors.userPass}
                >
                  Log In
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
