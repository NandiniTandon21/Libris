import authSlice from './slices/authSlice'
import booksSlice from './slices/booksSlice'
import rentalsSlice from './slices/rentalsSlice'
import profileSlice from './slices/profileSlice'
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    books: booksSlice,
    rentals: rentalsSlice,
    profile: profileSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
