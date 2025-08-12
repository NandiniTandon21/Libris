import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Rental {
  id: string
  bookId: number
  bookTitle: string
  userId: number
  rentedAt: string
  dueAt: string
  returnedAt?: string
  penalty: number
  penaltyPaid: number
}

interface RentalsState {
  rentals: Rental[]
  totalPenalties: number // This is global across all users - for compatibility
}

const initialState: RentalsState = {
  rentals: JSON.parse(localStorage.getItem('rentals') || '[]'),
  totalPenalties: 0, // Will be calculated from rentals data
}

const rentalsSlice = createSlice({
  name: 'rentals',
  initialState,
  reducers: {
    addRental: (state, action: PayloadAction<{ bookId: number; bookTitle: string; userId: number }>) => {
      const now = new Date()
      // 24 hour due date from rental time
      const dueDate = new Date(now.getTime() + 24 * 60 * 60 * 1000)

      const rental: Rental = {
        id: `${action.payload.bookId}-${Date.now()}`,
        bookId: action.payload.bookId,
        bookTitle: action.payload.bookTitle,
        userId: action.payload.userId,
        rentedAt: now.toISOString(),
        dueAt: dueDate.toISOString(),
        penalty: 0,
        penaltyPaid: 0,
      }

      state.rentals.push(rental)
      localStorage.setItem('rentals', JSON.stringify(state.rentals))
    },

    returnRental: (state, action: PayloadAction<string>) => {
      const rental = state.rentals.find(r => r.id === action.payload)
      if (rental && !rental.returnedAt) {
        rental.returnedAt = new Date().toISOString()
        localStorage.setItem('rentals', JSON.stringify(state.rentals))
      }
    },

    updatePenalties: (state) => {
      const now = new Date()
      let globalTotalPenalties = 0

      state.rentals.forEach(rental => {
        if (!rental.returnedAt) { // Only calculate penalties for active rentals
          const dueDate = new Date(rental.dueAt)
          if (now > dueDate) {
            // Calculate penalty: ₹5 per hour overdue
            const hoursOverdue = Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60))
            rental.penalty = hoursOverdue * 5 // ₹5 per hour
          } else {
            rental.penalty = 0
          }
          globalTotalPenalties += rental.penalty
        }
      })

      // Update global total (for compatibility with existing Dashboard code)
      state.totalPenalties = globalTotalPenalties
      localStorage.setItem('rentals', JSON.stringify(state.rentals))
    },

    payPenalties: (state, action: PayloadAction<number>) => {
      const userId = action.payload

      // Find all active rentals with penalties for this specific user
      const userActiveRentalsWithPenalties = state.rentals.filter(rental =>
        rental.userId === userId &&
        !rental.returnedAt &&
        rental.penalty > 0
      )

      // Mark penalties as paid for this user's rentals
      userActiveRentalsWithPenalties.forEach(rental => {
        rental.penaltyPaid += rental.penalty
        rental.penalty = 0
      })

      // Recalculate global total penalties after payment
      state.totalPenalties = state.rentals
        .filter(rental => !rental.returnedAt)
        .reduce((total, rental) => total + rental.penalty, 0)

      // Save to localStorage
      localStorage.setItem('rentals', JSON.stringify(state.rentals))
    },
  },
})

// Selector to check if a book is currently rented
export const selectIsBookRented = (state: any, bookId: number): boolean => {
  return state.rentals.rentals.some((rental: Rental) =>
    rental.bookId === bookId && !rental.returnedAt
  )
}

export const selectUserCurrentPenalties = (state: any, userId: number): number => {
  return state.rentals.rentals
    .filter((rental: Rental) => rental.userId === userId && !rental.returnedAt)
    .reduce((total: number, rental: Rental) => total + rental.penalty, 0)
}

// Updated selector to include both paid and current penalties
export const selectUserTotalPenaltiesPaid = (state: any, userId: number): number => {
  return state.rentals.rentals
    .filter((rental: Rental) => rental.userId === userId)
    .reduce((total: number, rental: Rental) => total + rental.penaltyPaid + rental.penalty, 0)
}

// Alternative: Keep the original selector for only paid penalties
export const selectUserOnlyPaidPenalties = (state: any, userId: number): number => {
  return state.rentals.rentals
    .filter((rental: Rental) => rental.userId === userId)
    .reduce((total: number, rental: Rental) => total + rental.penaltyPaid, 0)
}

export const selectUserActiveRentals = (state: any, userId: number): Rental[] => {
  return state.rentals.rentals
    .filter((rental: Rental) => rental.userId === userId && !rental.returnedAt)
}

export const selectUserCompletedRentals = (state: any, userId: number): Rental[] => {
  return state.rentals.rentals
    .filter((rental: Rental) => rental.userId === userId && rental.returnedAt)
}

export const { addRental, returnRental, updatePenalties, payPenalties } = rentalsSlice.actions
export default rentalsSlice.reducer