import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { logInUser,logOutUser,signUpUser } from "../services/authService";



export const login = createAsyncThunk(
    'auth/login',
    async({email,password}, {rejectWithValue}) =>{
        try{
            const data = await logInUser(email,password);
            console.log('API response for Login', data)
            return {
                user:data.user,
                token:data.token
            }
        }catch(error){
            return rejectWithValue(error.message)
        }
    }
);

export const signUp = createAsyncThunk(
    'auth/signUp',
    async({email,password,userName}, {rejectWithValue}) =>{
try{
const data = await signUpUser(email,password,userName);
// console.log("Data returned from API:", data);
return {
  user: data.signUp.user,
  token: data.signUp.token
};
}catch(error){
    console.error("Error in signUp thunk:", error);
    return rejectWithValue(error.message)
}
    }
);

export const checkTokenExpiration = () => (dispatch) => {
    const token = localStorage.getItem("token");
    const expiresAt = localStorage.getItem("expiresAt");
  
    if (token && expiresAt) {
      const now = Date.now();
      const expiryTime = Number(expiresAt);
  
      if (now >= expiryTime) {
        dispatch(signOut()); // Token expired, sign out immediately
      } else {
        // Schedule auto logout when token expires
        setTimeout(() => {
          dispatch(signOut());
        }, expiryTime - now);
      }
    }
  };
export const authSlice = createSlice({
name:'auth',
initialState:{
    user:null,
    token:null,
    status:'idle',
    error:null
},

reducers:{
    signOut(state) {
        state.user = null;
        state.token = null;
        state.status = "idle";
        localStorage.removeItem("token"); 
        localStorage.removeItem("expiresAt");
      },
},
extraReducers: (builder) => {
    builder.addCase(login.pending,(state)=>{
        state.status = 'loading';
        state.error = null;
    }),
    builder.addCase(login.fulfilled,(state,action)=>{
        state.status = 'succeeded';
       state.user = action.payload.user;
       state.token = action.payload.token;
       localStorage.setItem("token", action.payload.token);
       localStorage.setItem("expiresAt", action.payload.expiresAt);
    }),
    builder.addCase(login.rejected,(state,action)=>{
        state.status = 'failed';
        state.error = action.payload;
    }),
    builder.addCase(signUp.pending,(state)=>{
        state.status = 'loading';
        state.error = null;
    }),
    builder.addCase(signUp.fulfilled,(state,action)=>{
        state.status = 'succeeded';
       state.user = action.payload.user;
       state.token = action.payload.token;
       localStorage.setItem("token", action.payload.token);
    }),
    builder.addCase(signUp.rejected,(state,action)=>{
        state.status = 'failed';
        state.error = action.payload;
    })
 
}

});
export const { signOut } = authSlice.actions;

export default authSlice.reducer;