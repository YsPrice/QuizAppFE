import React from 'react';
import { Menu, MenuItem, IconButton, Avatar, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../redux/authSlice';

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const user = useSelector((state) => state.auth.user);
  const token = localStorage.getItem("token");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNav = () => {};

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = async () => {
    try {
      localStorage.removeItem("token");
      dispatch(signOut());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          textTransform: 'none',
          color: 'inherit',
          padding: 0,
          borderRadius: '50%',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            marginRight: 1,
          }}
        >
          {user.userName.charAt(0).toUpperCase()}
        </Avatar>
        <Typography
          sx={{
            fontSize: '1rem',
            fontWeight: 500,
            color: 'text.primary',
          }}
        >
          {user.userName}
        </Typography>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 2,
            minWidth: 150,
            bgcolor: 'background.paper',
            boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.2)',
          },
        }}
      >
        <MenuItem
          component={Link}
          to={'/account'}
          onClick={handleNav}
          sx={{
            fontSize: '0.9rem',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          Profile
        </MenuItem>
        <MenuItem
          onClick={handleLogOut}
          sx={{
            fontSize: '0.9rem',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
