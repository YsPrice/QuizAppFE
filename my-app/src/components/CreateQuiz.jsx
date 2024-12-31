import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Switch,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  createOption,
  deleteOption,
  editOption,
} from "../redux/optionSlice";
import {
  createQuestion,
  deleteQuestion,
  editQuestion,
} from "../redux/questionSlice";
import { addQuiz, getQuizById, updateQuiz, removeQuiz } from "../redux/quizSlice";
import DifficultyToggle from "./DifficultyChange";

export default function CreateQuiz() {
  const [difficulty, setDifficulty] = useState("EASY");
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const user = useSelector((state) => state.auth.user);
console.log(questions)
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);
  useEffect(() => {
    if (id) {
      const fetchQuiz = async () => {
        try {
          const response = await dispatch(getQuizById(id)).unwrap();
          const quiz = response.quiz;
          console.log(quiz)
  
          // Safely update all states based on response
          setQuizTitle(quiz.title || "Untitled Quiz");
          setDifficulty(quiz.difficulty || "EASY");
          setQuestions(
            quiz.questions?.map((q) => ({
              ...q,
              isEditing: false,
              content: q.content || "",
              options: q.options || [],
            })) || []
          );
        } catch (error) {
          console.error("Error fetching quiz:", error);
        }
      };
  
      fetchQuiz();
    }
  }, [id, dispatch]);
  
  

  const handleAddQuestion = async () => {
    try {
      const result = await dispatch(createQuestion({ quizId: id, content: "" })).unwrap();
      setQuestions((prevQuestions) => [
        ...prevQuestions,
        {
          id: result.id,
          content: "",
          options: [],
          isEditing: true,
        },
      ]);
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleUpdateQuestionLocal = (questionId, content) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId ? { ...q, content } : q
      )
    );
  };
  const handleSaveUpdatedQuestion = async (questionId) => {
    const questionToUpdate = questions.find((q) => q.id === questionId);
console.log(questionId)
    if (!questionToUpdate || !questionToUpdate.content.trim()) {
      alert("Question content cannot be empty.");
      return;
    }
    if (!questionToUpdate.options || questionToUpdate.options.length === 0) {
      alert("A question must have at least one option.");
      return;
    }
    const hasCorrectOption = questionToUpdate.options.some((option) => option.isCorrect);
    if (!hasCorrectOption) {
      alert("A question must have at least one correct option.");
      return;
    }
    const hasEmptyOption = questionToUpdate.options.some((option) => !option.content.trim());
    if (hasEmptyOption) {
      alert("Options cannot have empty content. Please fill in all options.");
      return;
    }
  
    try {
      await dispatch(editQuestion({ id: questionId, content: questionToUpdate.content })).unwrap();
      console.log(questionId)
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === questionId ? { ...q, isEditing: false } : q
        )
      );
    } catch (error) {
      console.error("Error saving question:", error);
    }
  };
  
  
const handleDeleteQuestion = async (questionId) => {
  try {
    // Directly pass questionId, ensure it's not wrapped as { id: questionId }
    await dispatch(deleteQuestion(questionId)).unwrap();
    setQuestions((prevQuestions) =>
      prevQuestions.filter((q) => q.id !== questionId)
    );
  } catch (error) {
    console.error("Error deleting question:", error);
  }
};

  

  const handleAddOption = async (questionId) => {
    try {
      const result = await dispatch(createOption({ questionId, content: "", isCorrect: false })).unwrap();
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: [
                  ...q.options,
                  { id: result.option.id, content: result.content, isCorrect: result.isCorrect },
                ],
              }
            : q
        )
      );
    } catch (error) {
      console.error("Error adding option:", error);
    }
  };

  const handleUpdateOptionLocal = (questionId, optionId, field, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optionId ? { ...o, [field]: value } : o
              ),
            }
          : q
      )
    );
  };

  const handleUpdateOptionAPI = async (questionId, optionId, field, value) => {
    try {
      await dispatch(editOption({ questionId, optionId, [field]: value })).unwrap();
    } catch (error) {
      console.error("Error updating option in API:", error);
    }
  };

  const handleDeleteOption = async (questionId, optionId) => {
    try {
      await dispatch(deleteOption({ questionId, optionId })).unwrap();
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: q.options.filter((o) => o.id !== optionId),
              }
            : q
        )
      );
    } catch (error) {
      console.error("Error deleting option:", error);
    }
  };

  const handleSaveQuiz = async () => {
    try {
      if (id) {
        await dispatch(updateQuiz({ id, title: quizTitle, difficulty, status:"DRAFT"})).unwrap();
        alert('Draft successfully saved')
      } else {
        const result = await dispatch(addQuiz({ title: quizTitle, status: "DRAFT", difficulty })).unwrap();
        if (result?.createQuiz?.id) navigate(`/create-quiz/${result.createQuiz.id}`);
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
    }
  };

  const handleCancelDraft = async () => {

    try {
      if (id) {
        await dispatch(removeQuiz(parseInt(id) )).unwrap();
      }
      navigate("/");
    } catch (error) {
      console.error("Error cancelling draft:", error);
    }
  };

  const confirmCancelDraft = () => {
    setShowConfirmDialog(true);
  };

  const handleCloseDialog = () => {
    setShowConfirmDialog(false);
  };


  const handlePublishQuiz = async () => {
    try {
      if(quizTitle === ""){
        alert("Quiz must have a title to be published")
        return
      }
      for (const question of questions) {
        if (question.options.length === 0) {
          alert("Each question must have at least one option.");
          return;
        }

        const hasCorrectOption = question.options.some((o) => o.isCorrect);
        if (!hasCorrectOption) {
          alert("Each question must have at least one correct option.");
          return;
        }

        await handleSaveUpdatedQuestion(question.id);
      }

      await dispatch(updateQuiz({ id, title: quizTitle, status: "PUBLISHED", difficulty })).unwrap();
      alert("Quiz published successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error publishing quiz:", error);
    }
  };
  const handleToggleEditQuestion = (questionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId ? { ...q, isEditing: !q.isEditing } : q
      )
    );
  };
  
  if (!user) {
    return (
      <Container sx={{ padding: 4, maxWidth: "800px" }}>
        <Alert severity="error">You must be logged in to create or edit a quiz.</Alert>
        <Link to="/login">Go to Login</Link>
      </Container>
    );
  }

  return (
    <Container sx={{ padding: 4, maxWidth: "800px" }}>
         <Button component={Link} to="/" variant="outlined" sx={{ textTransform: 'none' }}>
                Return Home
              </Button>

      <Typography variant="h4" gutterBottom>
        {id ? "Edit Quiz" : "Create New Quiz"}
      </Typography>
      <DifficultyToggle difficulty={difficulty} setDifficulty={setDifficulty} />
      <TextField
        fullWidth
        label="Quiz Title"
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
        sx={{ marginBottom: 4 }}
      />

{questions.map((question, index) => (
  <Box key={question.id || index} sx={{ marginBottom: 4, border: "1px solid #ccc", padding: 2 }}>
    {question.isEditing ? (
      <>
        <TextField
          fullWidth
          label="Question Content"
          value={question.content || ""}
          onChange={(e) => handleUpdateQuestionLocal(question.id, e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        <Typography variant="h6">Options:</Typography>
        {question.options.map((option) => (
          <Box key={option.id} sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
            <TextField
              label="Option Content"
              value={option.content || ""}
              onChange={(e) =>
                handleUpdateOptionLocal(question.id, option.id, "content", e.target.value)
              }
              onBlur={(e) =>
                handleUpdateOptionAPI(question.id, option.id, "content", e.target.value)
              }
              sx={{ flexGrow: 1, marginRight: 2 }}
            />
      <FormControlLabel
    control={
      <Switch
        checked={option.isCorrect || false}
        onChange={(e) => {
          const newValue = e.target.checked;
          handleUpdateOptionLocal(question.id, option.id, "isCorrect", newValue);
          handleUpdateOptionAPI(question.id, option.id, "isCorrect", newValue);
        }}
      />
    }
    label="Correct Answer?"
  />
            <Button
              variant="text"
              color="error"
              onClick={() => handleDeleteOption(question.id, option.id)}
            >
              Delete Option
            </Button>
          </Box>
        ))}

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => handleAddOption(question.id)}
        >
          + Add Option
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={() => handleSaveUpdatedQuestion(question.id)}
          sx={{ marginTop: 2 }}
        >
          Save Question
        </Button>
      </>
    ) : (
      <Box>
        <Typography>{question.content}</Typography>
        <Button
          variant="text"
          color="primary"
          onClick={() => handleToggleEditQuestion(question.id)}
        >
          Edit Question
        </Button>
        <Button
          variant="text"
          color="error"
          onClick={() => handleDeleteQuestion(question.id)}
        >
          Delete Question
        </Button>
      </Box>
    )}
  </Box>
))}


      <Container>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap", marginTop: 2 }}>
          <Button variant="contained" color="primary" onClick={handleAddQuestion}>
            + Add Question
          </Button>
          <Button variant="contained" color="error" onClick={confirmCancelDraft}>
            Delete Quiz
          </Button>
          <Button variant="contained" color="warning" onClick={handleSaveQuiz}>
            Save Draft
          </Button>
          <Button variant="contained" color="success" onClick={handlePublishQuiz}>
            Publish Quiz
          </Button>
        </Box>
      </Container>


      <Dialog
        open={showConfirmDialog}
        onClose={handleCloseDialog}
        aria-labelledby="confirm-cancel-draft-title"
        aria-describedby="confirm-cancel-draft-description"
      >
        <DialogTitle id="confirm-cancel-draft-title">Cancel Draft</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-cancel-draft-description">
            Are you sure you want to delete this quiz? All current progress will be erased.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            No, Keep Quiz
          </Button>
          <Button
            onClick={() => {
              handleCancelDraft();
              handleCloseDialog();
            }}
            color="error"
          >
            Yes, Delete Quiz
          </Button>
        </DialogActions>
      </Dialog>

    </Container>

    
  );
}
