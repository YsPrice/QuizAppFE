import React, { useState, useEffect } from "react";
import { Container, Typography, Grid, Button, Box } from "@mui/material";
import AccountMenu from "../components/AccountMenu";
import QuizCard from "../components/QuizCard";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addQuiz } from "../redux/quizSlice";
import { fetchQuizzes } from "../services/quizService";

export default function HomePage() {
  const user = useSelector((state) => state.auth.user);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCreateQuiz = async () => {
    try {
      if (user) {
        const result = await dispatch(
          addQuiz({
            title: "Untitled Draft",
            difficulty: "EASY",
            status: "DRAFT",
          })
        ).unwrap();

        if (result?.createQuiz.id) {
          navigate(`/create-quiz/${result.createQuiz.id}`);
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
  };

  useEffect(() => {
    const fetchAllQuizzes = async () => {
      try {
        setLoading(true);
        const res = await fetchQuizzes();
        setQuizzes(res || []);
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllQuizzes();
  }, []);

  if (loading) {
    return (
      <Container sx={{ padding: 4, textAlign: "center" }}>
        <Typography variant="h4" color="text.secondary">
          Loading quizzes...
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      sx={{
        padding: 4,
        border: "1px solid",
        borderColor: "grey.300",
        borderRadius: 2,
        minHeight: "100vh",
        bgcolor: "background.default",
        boxShadow: 2,
        maxWidth: "lg",
        margin: "auto",
      }}
    >
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h3" sx={{ fontWeight: 600 }}>
          Dashboard
        </Typography>
        {user ? (
          <AccountMenu />
        ) : (
          <Button variant="outlined" component={Link} to="/login">
            Login
          </Button>
        )}
        <Button variant="outlined" component={Link} to="/search">
          Advanced Search
        </Button>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        sx={{
          marginY: 3,
          fontSize: "1rem",
          paddingY: 2,
          paddingX: 3,
          borderRadius: 2,
          textTransform: "none",
          width: "100%",
          boxShadow: 3,
        }}
        onClick={handleCreateQuiz}
      >
        + Create New Quiz
      </Button>

      {!loading && quizzes.length === 0 && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: "center", marginTop: 4 }}
        >
          No quizzes available at the moment.
        </Typography>
      )}

      <Typography variant="h5" sx={{ marginTop: 4, marginBottom: 2, fontWeight: 500 }}>
        All Quizzes
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{
          justifyContent: "center",
          gap: 2,
        }}
      >
        {Array.isArray(quizzes.quizzes) &&
          quizzes.quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              id={quiz.id}
              title={quiz.title}
              difficulty={quiz.difficulty}
              status={quiz.status}
              createdBy={quiz.createdBy?.userName}
              isEditable={quiz.createdBy?.id === user?.id}
            />
          ))}
      </Grid>
    </Container>
  );
}
