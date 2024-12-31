import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createQuestionAPI,
  editQuestionAPI,
  deleteQuestionAPI,
  fetchQuestions
} from '../services/questionService';

export const fetchQuestionsThunk = createAsyncThunk(
    'questions/fetchQuestions',
    async (quizId, { rejectWithValue }) => {
      try {
        const data = await fetchQuestions(quizId);
        return { quizId, questions: data };
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
export const createQuestion = createAsyncThunk(
  'questions/createQuestion',
  async ({ quizId, content }, { rejectWithValue }) => {
    try {
      return await createQuestionAPI(quizId, content);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editQuestion = createAsyncThunk(
  'questions/editQuestion',
  async ({ id, content }, { rejectWithValue }) => {
    try {
      return await editQuestionAPI(id, content);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteQuestion = createAsyncThunk(
  "questions/deleteQuestion",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteQuestionAPI(id); 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



const questionSlice = createSlice({
  name: 'questions',
  initialState: {
    questions: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createQuestion.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.questions.push(action.payload);
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(editQuestion.fulfilled, (state, action) => {
        const index = state.questions.findIndex(
          (q) => q.id === action.payload.id
        );
        if (index !== -1) state.questions[index] = action.payload;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.filter(
          (q) => q.id !== action.meta.arg
        );
      });
  },
});

export default questionSlice.reducer;
