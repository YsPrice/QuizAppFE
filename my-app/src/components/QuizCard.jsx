import React, { useEffect, useMemo } from 'react';
import { Card, CardContent, Typography, Button, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { getSavedQuizzes, unsaveQuizAction, saveQuizAction } from '../redux/quizSlice';

export default function QuizCard({ id, title, difficulty, status, createdBy, isEditable }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const savedQuizzes = useSelector((state) => state.quizzes.savedQuizzes);
  const isSaved = useMemo(() => savedQuizzes.includes(id), [savedQuizzes, id]);

  useEffect(() => {
    if (user) {
      dispatch(getSavedQuizzes());
    }
  }, [dispatch, user]);

  const handleEdit = () => {
    navigate(`/create-quiz/${id}`);
  };

  const handleTakeQuiz = () => {
    if (status === "DRAFT") {
      alert("You cannot take a draft quiz.");
      return;
    }
    user ? navigate(`/take-quiz/${id}`) : navigate('/login');
  };

  const handleSaveQuiz = async () => {
    try {
      if (isSaved) {
        await dispatch(unsaveQuizAction(id)).unwrap();
      } else {
        await dispatch(saveQuizAction(id)).unwrap();
      }
      dispatch(getSavedQuizzes());
    } catch (error) {
      console.error("Error saving or unsaving quiz:", error);
    }
  };

  return (
    <Card sx={{ minWidth: 200, maxWidth: 300, margin: '1rem' }}>
      <CardContent>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="body2">Difficulty: {difficulty}</Typography>
        <Typography variant="body2">Created By: {createdBy}</Typography>

        {status === "PUBLISHED" ? (
          <Button variant="contained" color="primary" onClick={handleTakeQuiz}>
            Take Quiz
          </Button>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Draft quizzes cannot be taken.
          </Typography>
        )}

        {user && (
          <IconButton onClick={handleSaveQuiz} color={isSaved ? "primary" : "default"}>
            {isSaved ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        )}

        {isEditable && (
          <Box sx={{ marginTop: 2 }}>
            <Button variant="contained" color="primary" onClick={handleEdit}>
              Edit Quiz
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
