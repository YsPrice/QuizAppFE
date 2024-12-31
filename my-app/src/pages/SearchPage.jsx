import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Button, Grid } from '@mui/material';
import QuizCard from '../components/QuizCard';
import SearchBar from '../components/SearchBar';
import { Link } from 'react-router-dom';
import { fetchQuizzes } from '../services/quizService';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch quizzes from the API
  useEffect(() => {
    const fetchAllQuizzes = async () => {
      try {
        const data = await fetchQuizzes();
        setQuizzes(data.quizzes || []);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllQuizzes();
  }, []);

  // Filter and sort quizzes based on user input
  const filteredQuizzes = quizzes
    ?.filter((quiz) => quiz.title?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === 'title') return a.title.localeCompare(b.title);
      if (sortOption === 'difficulty') {
        const difficultyOrder = ['EASY', 'MEDIUM', 'HARD'];
        return difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty);
      }
      return 0;
    });

  return (
    <Container sx={{ padding: 4, maxWidth: 'lg' }}>
      <Box sx={{ marginBottom: 3 }}>
        <Button component={Link} to="/" variant="outlined" sx={{ textTransform: 'none' }}>
          Return Home
        </Button>
      </Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Find Quizzes
      </Typography>
      <Box sx={{ marginBottom: 4 }}>
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />
      </Box>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Search Results
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : filteredQuizzes && filteredQuizzes.length > 0 ? (
        <Grid container spacing={2}>
          {filteredQuizzes.map((quiz) => (
            <Grid item key={quiz.id} xs={12} sm={6} md={4}>
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
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', marginTop: 4 }}>
          No quizzes found.
        </Typography>
      )}
    </Container>
  );
}
