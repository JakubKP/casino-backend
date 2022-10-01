import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'
import betReducer from '../features/bets/betsSlice'
import messageReducer from '../features/messages/messagesSlice'


export const store = configureStore({
  reducer: {
    auth: authReducer,
    bet: betReducer,
    message: messageReducer,
  },
})
