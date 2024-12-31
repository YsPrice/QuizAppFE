import { configureStore,combineReducers } from '@reduxjs/toolkit'
import authReducer from './authSlice';
import quizReducer from './quizSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import quizTakingReducer from './quizTakingSlice';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
};
const rootReducer = combineReducers({
  quizzes: quizReducer,
  auth: authReducer,
  quizTaking:quizTakingReducer
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
 
  
});
export const persistor = persistStore(store);
export default store;