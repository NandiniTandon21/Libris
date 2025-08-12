import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ProfileState {
  userProfiles: {
    [userId: string]: {
      profilePicture: string | null
      statistics: {
        totalBooksRented: number
        currentActiveRentals: number
        totalPenaltiesPaid: number
      }
    }
  }
}

const initialState: ProfileState = {
  userProfiles: JSON.parse(localStorage.getItem('userProfiles') || '{}'),
}

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfilePicture: (state, action: PayloadAction<{ userId: number; picture: string }>) => {
      const { userId, picture } = action.payload
      if (!state.userProfiles[userId]) {
        state.userProfiles[userId] = {
          profilePicture: null,
          statistics: {
            totalBooksRented: 0,
            currentActiveRentals: 0,
            totalPenaltiesPaid: 0,
          }
        }
      }
      state.userProfiles[userId].profilePicture = picture
      localStorage.setItem('userProfiles', JSON.stringify(state.userProfiles))
    },

    updateStatistics: (state, action: PayloadAction<{
      userId: number
      totalBooksRented?: number
      currentActiveRentals?: number
      totalPenaltiesPaid?: number
    }>) => {
      const { userId, ...stats } = action.payload
      if (!state.userProfiles[userId]) {
        state.userProfiles[userId] = {
          profilePicture: null,
          statistics: {
            totalBooksRented: 0,
            currentActiveRentals: 0,
            totalPenaltiesPaid: 0,
          }
        }
      }
      state.userProfiles[userId].statistics = { ...state.userProfiles[userId].statistics, ...stats }
      localStorage.setItem('userProfiles', JSON.stringify(state.userProfiles))
    },

    initUserProfile: (state, action: PayloadAction<number>) => {
      const userId = action.payload
      if (!state.userProfiles[userId]) {
        state.userProfiles[userId] = {
          profilePicture: null,
          statistics: {
            totalBooksRented: 0,
            currentActiveRentals: 0,
            totalPenaltiesPaid: 0,
          }
        }
      }
    },
  },
})

export const { updateProfilePicture, updateStatistics, initUserProfile } = profileSlice.actions

// Selectors for user-specific data
export const selectUserProfile = (state: any, userId: number) =>
  state.profile.userProfiles[userId] || {
    profilePicture: null,
    statistics: {
      totalBooksRented: 0,
      currentActiveRentals: 0,
      totalPenaltiesPaid: 0,
    }
  }

export default profileSlice.reducer
