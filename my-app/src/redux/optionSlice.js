import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createOptionAPI,
  deleteOptionAPI,
  editOptionAPI,
  fetchOptionsAPI,
} from "../services/optionService";

export const fetchOptions = createAsyncThunk(
  "options/fetchOptions",
  async (questionId, { rejectWithValue }) => {
    try {
      const options = await fetchOptionsAPI(questionId);
      return { questionId, options }; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const createOption = createAsyncThunk(
  "options/createOption",
  async ({ questionId, isCorrect, content }, { rejectWithValue }) => {
    try {
      const option = await createOptionAPI(questionId, isCorrect, content);
      return { questionId, option };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const deleteOption = createAsyncThunk(
  "options/deleteOption",
  async ({ questionId, optionId }, { rejectWithValue }) => {
    try {
      const message = await deleteOptionAPI(questionId, optionId);
      return { questionId, optionId, message };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const editOption = createAsyncThunk(
  "options/editOption",
  async ({ questionId, optionId, isCorrect, content }, { rejectWithValue }) => {
    try {
      const updatedOption = await editOptionAPI(questionId, optionId, isCorrect, content);
      return { questionId, updatedOption };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const optionSlice = createSlice({
  name: "options",
  initialState: {
    byQuestionId: {}, 
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchOptions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchOptions.fulfilled, (state, action) => {
        const { questionId, options } = action.payload;
        state.byQuestionId[questionId] = options;
        state.status = "succeeded";
      })
      .addCase(fetchOptions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })


      .addCase(createOption.fulfilled, (state, action) => {
        const { questionId, option } = action.payload;
        if (state.byQuestionId[questionId]) {
          state.byQuestionId[questionId].push(option);
        } else {
          state.byQuestionId[questionId] = [option];
        }
      })

   
      .addCase(deleteOption.fulfilled, (state, action) => {
        const { questionId, optionId } = action.payload;
        if (state.byQuestionId[questionId]) {
          state.byQuestionId[questionId] = state.byQuestionId[questionId].filter(
            (opt) => opt.id !== optionId
          );
        }
      })


      .addCase(editOption.fulfilled, (state, action) => {
        const { questionId, updatedOption } = action.payload;
        if (state.byQuestionId[questionId]) {
          const index = state.byQuestionId[questionId].findIndex(
            (opt) => opt.id === updatedOption.id
          );
          if (index !== -1) {
            state.byQuestionId[questionId][index] = updatedOption;
          }
        }
      });
  },
});

export default optionSlice.reducer;
