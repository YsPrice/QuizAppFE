import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../redux/authSlice';

import { useNavigate } from 'react-router-dom';
const SignUpPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const {status,error,user} = useSelector((state)=> state.auth);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try{
        dispatch(signUp({email,password, userName}))
        navigate('/');
    }catch(error){
        console.error('Error during sign-up:', error);
    }
 
  };
  console.log(email)

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
        <Button component={Link} to="/" variant="outlined" sx={{ textTransform: 'none' }}>
                 Return Home
               </Button>
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>
      {status === 'loading' && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user && <p>Welcome, {user.userName}!</p>}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="User Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleSignUp}>
          Sign Up
        </Button>
        <Typography>Have an account?</Typography>
        <Link to="/login">Log In</Link>
      </Box>
    </Container>
  );
}

export default SignUpPage;