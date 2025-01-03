import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import QuizPage from '../pages/QuizPage'; 
import CreateQuiz from '../components/CreateQuiz';
import SignIn from '../pages/SignIn';
import SignUpPage from '../pages/SignUp';
import AccountInfoPage from '../pages/AccountInfo';
import SearchPage from '../pages/SearchPage';
export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz/:id" element={<QuizPage />} /> 
        <Route path="/create-quiz/:id" element={<CreateQuiz />} />
        <Route path="/edit-quiz/:id" element={<CreateQuiz />} /> 
        <Route path="take-quiz/:id" element={<QuizPage/>}/>
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/account" element={<AccountInfoPage />} />
        <Route path="/search" element={<SearchPage />} />
        

      </Routes>
    </Router>
  );
}
