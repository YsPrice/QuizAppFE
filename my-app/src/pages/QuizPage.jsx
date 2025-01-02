import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Typography, Button, Box, RadioGroup, FormControlLabel, Radio, CircularProgress, Paper } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchQuizById } from "../services/quizService";
import { setAnswer, nextQuestion, previousQuestion, completeQuiz, resetQuiz } from "../redux/quizTakingSlice";

const TakeQuiz = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentQuestionIndex, answers, isComplete, score } = useSelector((state) => state.quizTaking);
  const [quiz, setQuiz] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const fetchedQuiz = await fetchQuizById(id);
        console.log("Fetched Quiz:", fetchedQuiz);
        setQuiz(fetchedQuiz.quiz);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <CircularProgress />
        <Typography variant="h5" sx={{ marginTop: 2 }}>
          Loading Quiz...
        </Typography>
      </Container>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <Container sx={{ textAlign: "center", marginTop: 4 }}>
        <Typography variant="h4" color="error" sx={{ marginBottom: 2 }}>
          Quiz Not Found
        </Typography>
        <Button variant="contained" component={Link} to="/">
          Return Home
        </Button>
      </Container>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleResetQuiz = () => {
    dispatch(resetQuiz());
    navigate("/");
  };

  const handleNext = () => {
    const isCorrect = currentQuestion.options.find((option) => option.id === selectedOption)?.isCorrect;
    dispatch(setAnswer({ questionId: currentQuestion.id, selectedOptionId: selectedOption, isCorrect }));
    dispatch(nextQuestion({ totalQuestions: quiz.questions.length }));
    setSelectedOption("");
  };

  const handlePrevious = () => {
    dispatch(previousQuestion());
    setSelectedOption(answers[currentQuestion.id]?.selectedOptionId || "");
  };

  const handleSubmit = () => {
    const isCorrect = currentQuestion.options.find((option) => option.id === selectedOption)?.isCorrect;
    dispatch(setAnswer({ questionId: currentQuestion.id, selectedOptionId: selectedOption, isCorrect }));
    dispatch(completeQuiz({ quizId: id })); 
    
  };

  if (isComplete) {
    return (
      <Container sx={{ textAlign: "center", marginTop: 4 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            Quiz Completed!
          </Typography>
          <Typography variant="h5" color="success.main" sx={{ marginBottom: 4 }}>
            Your Score: {score} / {quiz.questions.length}
          </Typography>
          <Button variant="contained" color="primary" onClick={handleResetQuiz}>
            Take Another Quiz
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ marginTop: 4, maxWidth: "md" }}>
       <Button onClick={handleResetQuiz} component={Link} to="/" variant="outlined" sx={{ textTransform: 'none' }}>
                Return Home
              </Button>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 600 }}>
          {quiz.title}
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: 2, color: "text.secondary" }}>
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 3 }}>
          {currentQuestion.content}
        </Typography>

        <RadioGroup value={selectedOption} onChange={handleOptionChange}>
          {currentQuestion.options.map((option) => (
            <FormControlLabel
              key={option.id}
              value={option.id}
              control={<Radio />}
              label={option.content}
              sx={{
                marginBottom: 1,
                "& .MuiTypography-root": {
                  fontSize: "1rem",
                },
              }}
            />
          ))}
        </RadioGroup>

        <Box sx={{ marginTop: 4, display: "flex", justifyContent: "space-between" }}>
          <Button variant="contained" color="primary" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
            Previous
          </Button>
          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <Button variant="contained" color="secondary" onClick={handleNext} disabled={!selectedOption}>
              Next
            </Button>
          ) : (
            <Button variant="contained" color="success" onClick={handleSubmit} disabled={!selectedOption}>
              Submit Quiz
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default TakeQuiz;
