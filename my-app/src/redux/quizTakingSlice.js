import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { completeQuizAPI } from "../services/quizService";

const initialState = {
  currentQuestionIndex: 0,
  answers: {}, 
  correctAnswers: {}, 
  isComplete: false, 
  score: 0,
  quizzesTaken: [], // Add a field to track completed quizzes
  status: "idle", // For async actions
  error: null, // For error handling
};

// Async thunk for completing a quiz
export const completeQuiz = createAsyncThunk(
  "quizTaking/completeQuiz",
  async ({ quizId }, { rejectWithValue }) => {
    try {
      const response = await completeQuizAPI(quizId); // Send quiz ID to the backend
      return response; // Return the response from the API
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const quizTakingSlice = createSlice({
  name: "quizTaking",
  initialState,
  reducers: {
    setAnswer: (state, action) => {
      const { questionId, selectedOptionId, isCorrect } = action.payload;
      state.answers[questionId] = selectedOptionId;
      state.correctAnswers[questionId] = Boolean(isCorrect);
      console.log("Answer recorded:", isCorrect);
    },
    nextQuestion: (state, action) => {
      if (state.currentQuestionIndex < action.payload.totalQuestions - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    resetQuiz: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(completeQuiz.pending, (state) => {
        state.status = "loading";
      })
     
      
      .addCase(completeQuiz.fulfilled, (state, action) => {
        const newQuizId = action.payload; 
        if (!state.quizzesTaken.includes(newQuizId)) {
          state.quizzesTaken.push(newQuizId); 
        }
        state.isComplete = true
      })
      

      .addCase(completeQuiz.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        console.error("Error completing quiz:", action.payload);
      });
  },
});

export const { setAnswer, nextQuestion, previousQuestion, resetQuiz } = quizTakingSlice.actions;

export default quizTakingSlice.reducer;
