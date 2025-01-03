import React from 'react';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HomePage from './pages/HomePage'
import AppRoutes from './routes/AppRoutes'
import testConnection from './services/test'
import { getSavedQuizzes } from "./redux/quizSlice";
import { useEffect } from "react";
import { useDispatch,useSelector } from 'react-redux'
import { checkTokenExpiration } from './redux/authSlice'


function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  useEffect(() => {
    dispatch(checkTokenExpiration());
  }, [dispatch]);
  useEffect(() => {
    if (token) {
      dispatch(getSavedQuizzes());
    }
  }, [token, dispatch]);



  testConnection();
  return (
    <>
      <div>
 <AppRoutes/>

      </div>
     
    </>
  )
}

export default App
