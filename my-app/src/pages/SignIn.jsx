import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { Link, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector} from 'react-redux';
import { login } from '../redux/authSlice';

 const SignIn = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {status,error} = useSelector((state)=> state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try{
       await dispatch(login({email,password})).unwrap();
        navigate('/')
    }catch(error){
        console.error("signIn failed", error)
    }

  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
            <Button component={Link} to="/" variant="outlined" sx={{ textTransform: 'none' }}>
                     Return Home
                   </Button>
              {status === "failed" && <p style={{ color: "red" }}>{error}</p>}
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login
        </Button>
      </Box>
       <Typography>Don't have an account?</Typography>
              <Link to="/signup">Sign Up</Link>
   
    </Container>
  );
}
export default SignIn;