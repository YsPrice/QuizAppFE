import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchQuizById,fetchQuizzes,createQuiz,editQuiz,deleteQuiz,fetchSavedQuizzes, fetchQuizzesTaken, saveQuiz, unsaveQuizAPI  } from "../services/quizService";

export const getQuizzes = createAsyncThunk("quizzes/getQuizzes", async(_, {rejectWithValue})=>{
    try{
        return await fetchQuizzes();
    }catch(error){
        return rejectWithValue(error.message)
    }
});

export const getQuizById = createAsyncThunk("quizzes/getQuizById", async(id,{ rejectWithValue })=>{
    try{
        return await fetchQuizById(id)
    }catch(error){
        return rejectWithValue(error.message)
    }
});


export const addQuiz = createAsyncThunk("quizzes/createQuiz", async({title,difficulty,status}, {rejectWithValue}) =>{
    try{
        return await createQuiz(title,difficulty,status)
    }catch(error){
        return rejectWithValue(error.message)
    }
})
export const updateQuiz = createAsyncThunk("quizzes/updateQuiz", async ({ id, title, difficulty, status }, { rejectWithValue }) => {
    try {
      return await editQuiz(id, title, difficulty, status);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
  
  export const removeQuiz = createAsyncThunk("quizzes/removeQuiz", async (id, { rejectWithValue }) => {
    try {
      return await deleteQuiz(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });

  export const getSavedQuizzes = createAsyncThunk(
    "quizzes/getSavedQuizzes",
    async (_, { rejectWithValue }) => {
      try {
        const response = await fetchSavedQuizzes();
 
        return response.getSavedQuizzes.map((quiz) => quiz.id); 
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  
  export const getQuizzesTaken = createAsyncThunk("quizzes/getQuizzesTaken", async (_, { rejectWithValue }) => {
    try {
      return await fetchQuizzesTaken();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
  
  export const saveQuizAction = createAsyncThunk("quizzes/saveQuiz", async (quizId, { rejectWithValue }) => {
    try {
      const response = await saveQuiz(quizId);
      return response.savedQuizzes;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
  
  export const unsaveQuizAction = createAsyncThunk("quizzes/unsaveQuiz", async (quizId, { rejectWithValue }) => {
    try {
      const response = await unsaveQuizAPI(quizId);
      return response.unsaveQuiz.savedQuizzes;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
 
  
  const quizSlice = createSlice({
    name: "quizzes",
    initialState: {
      quizzes: [],
      savedQuizzes: [],
      quizzesTaken: [],
      currentQuiz: null,
      status: "idle",
      error: null,
    },
    reducers: {
      resetQuizState(state) {
        state.quizzes = [];
        state.savedQuizzes = [];
        state.quizzesTaken = [];
        state.currentQuiz = null;
        state.status = "idle";
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
      
        .addCase(getQuizzes.pending, (state) => {
          state.status = "loading";
        })
        .addCase(getQuizzes.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.quizzes = action.payload;
        })
        .addCase(getQuizzes.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        })

        .addCase(getQuizById.pending, (state) => {
          state.status = "loading";
        })
        .addCase(getQuizById.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.currentQuiz = action.payload;
        })
        .addCase(getQuizById.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        })
   
        .addCase(addQuiz.fulfilled, (state, action) => {
          console.log('addQuiz payload:', action.payload); // Debugging
          const newQuiz = action.payload.createQuiz || action.payload; // Adjust based on payload structure
          if (Array.isArray(state.quizzes)) {
            state.quizzes.push(newQuiz); // Add to the array if quizzes is already an array
          } else {
            state.quizzes = [newQuiz]; // Initialize as an array if it's not
          }
        })
        
        .addCase(updateQuiz.fulfilled, (state, action) => {
          const index = state.quizzes?.findIndex((quiz) => quiz.id === action.payload.id);
          if (index !== -1) {
            state.quizzes[index] = action.payload;
          }
        })
   
        .addCase(removeQuiz.fulfilled, (state, action) => {
          state.quizzes = state.quizzes.filter((quiz) => quiz.id !== action.meta.arg);
        })
      
        .addCase(unsaveQuizAction.fulfilled, (state, action) => {
          state.savedQuizzes = action.payload; 
        })
        .addCase(saveQuizAction.fulfilled, (state, action) => {

          const quizId = action.meta.arg; 
   
          if (!state.savedQuizzes.includes(quizId)) {
            console.log(state.savedQuizzes)
            state.savedQuizzes.push(quizId);
          }
        })
        .addCase(unsaveQuizAction.rejected, (state, action) => {
          state.error = action.payload;
        })
        .addCase(getSavedQuizzes.fulfilled, (state, action) => {
          state.savedQuizzes = action.payload; 
        })
        .addCase(getSavedQuizzes.rejected, (state, action) => {
          state.error = action.payload;
        });
    },
  });
  
  export const { resetQuizState } = quizSlice.actions;
  export default quizSlice.reducer;
  