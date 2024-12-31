import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { fetchSavedQuizzes, getCreatedQuizzesAPI, fetchQuizzesTaken } from '../services/quizService';
import QuizCard from '../components/QuizCard';
import { Link } from 'react-router-dom';

export default function AccountInfoPage() {
  const user = useSelector((state) => state.auth.user);
  const [savedQuizzes, setSavedQuizzes] = useState([]);
  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  const [quizzesTaken, setQuizzesTaken] = useState([]);
  const [loadingSavedQuizzes, setLoadingSavedQuizzes] = useState(true);
  const [loadingCreatedQuizzes, setLoadingCreatedQuizzes] = useState(true);
  const [loadingQuizzesTaken, setLoadingQuizzesTaken] = useState(true);

  useEffect(() => {
    if (user) {
      // Fetch saved quizzes
      fetchSavedQuizzes()
        .then((res) => {
          
          setSavedQuizzes(res.getSavedQuizzes);
          setLoadingSavedQuizzes(false);
        })
        .catch((error) => {
          console.error('Error fetching saved quizzes:', error);
          setLoadingSavedQuizzes(false);
        });

      // Fetch created quizzes
      getCreatedQuizzesAPI(user.id)
        .then((res) => {
          setCreatedQuizzes(res.getCreatedQuizzes);
          setLoadingCreatedQuizzes(false);
        })
        .catch((error) => {
          console.error('Error fetching created quizzes:', error);
          setLoadingCreatedQuizzes(false);
        });

      // Fetch quizzes taken
      fetchQuizzesTaken()
        .then((res) => {
          console.log(res)
          setQuizzesTaken(res.getQuizzesTaken);
          setLoadingQuizzesTaken(false);
        })
        .catch((error) => {
          console.error('Error fetching quizzes taken:', error);
          setLoadingQuizzesTaken(false);
        });
    }
  }, [user]);

  if (!user) {
    return <Typography variant="h6">No user logged in.</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Button component={Link} to="/" variant="outlined" sx={{ textTransform: 'none' }}>
        Return Home
      </Button>
      <Typography variant="h4" gutterBottom>
        Account Information
      </Typography>
      <Box>
        <Typography variant="body1">Name: {user.userName}</Typography>
        <Typography variant="body1">Email: {user.email}</Typography>
      </Box>

      <Typography variant="h5" sx={{ marginTop: 4 }}>
        Saved Quizzes
      </Typography>
      {loadingSavedQuizzes ? (
        <Typography>Loading saved quizzes...</Typography>
      ) : savedQuizzes.length > 0 ? (
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {savedQuizzes.map((quiz) => (
            <Grid item xs={12} sm={6} md={4} key={quiz.id}>
              <QuizCard
                id={quiz.id}
                title={quiz.title}
                difficulty={quiz.difficulty}
                status={quiz.status}
                createdBy={quiz.createdBy?.userName}
                isEditable
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No saved quizzes found.</Typography>
      )}

      <Typography variant="h5" sx={{ marginTop: 4 }}>
        Created Quizzes
      </Typography>
      {loadingCreatedQuizzes ? (
        <Typography>Loading created quizzes...</Typography>
      ) : createdQuizzes.length > 0 ? (
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {createdQuizzes.map((quiz) => (
            <Grid item xs={12} sm={6} md={4} key={quiz.id}>
              <QuizCard
                id={quiz.id}
                title={quiz.title}
                difficulty={quiz.difficulty}
                status={quiz.status}
                createdBy={quiz.createdBy?.userName}
                isEditable
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No created quizzes found.</Typography>
      )}

      <Typography variant="h5" sx={{ marginTop: 4 }}>
        Quizzes Taken
      </Typography>
      {loadingQuizzesTaken ? (
        <Typography>Loading quizzes taken...</Typography>
      ) : quizzesTaken.length > 0 ? (
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          {quizzesTaken.map((quiz) => (
            <Grid item xs={12} sm={6} md={4} key={quiz.id}>
              <QuizCard
                id={quiz.id}
                title={quiz.title}
                difficulty={quiz.difficulty}
                status={quiz.status}
                createdBy={quiz.createdBy?.userName}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No quizzes taken found.</Typography>
      )}
    </Container>
  );
}
