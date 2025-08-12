import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface Book {
  id: number
  title: string
  body: string // Using as description/content
  userId: number
  isRented: boolean
  rentedBy?: number
  rentedAt?: string
  dueAt?: string
  author?: string
}

interface BooksState {
  books: Book[]
  filteredBooks: Book[]
  userWishlists: { [userId: number]: number[] } // User-specific wishlists
  isLoading: boolean
  error: string | null
  searchQuery: string
  filterStatus: 'all' | 'available' | 'rented'
}

// Fetch books from JSONPlaceholder (using posts as books)
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts')
    const posts = await response.json()

    // Transform posts into books format
    const books: Book[] = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      body: post.body,
      userId: post.userId,
      isRented: false,
      author: `Author ${post.userId}`, // Dummy author based on userId
    }))

    return books
  }
)

const initialState: BooksState = {
  books: [],
  filteredBooks: [],
  userWishlists: JSON.parse(localStorage.getItem('userWishlists') || '{}'), // Load user-specific wishlists
  isLoading: false,
  error: null,
  searchQuery: '',
  filterStatus: 'all',
}

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      booksSlice.caseReducers.applyFilters(state)
    },
    setFilterStatus: (state, action: PayloadAction<'all' | 'available' | 'rented'>) => {
      state.filterStatus = action.payload
      booksSlice.caseReducers.applyFilters(state)
    },
    applyFilters: (state) => {
      let filtered = state.books

      // Apply search filter
      if (state.searchQuery) {
        filtered = filtered.filter(book =>
          book.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          book.body.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          book.author?.toLowerCase().includes(state.searchQuery.toLowerCase())
        )
      }

      // Apply status filter
      if (state.filterStatus !== 'all') {
        filtered = filtered.filter(book =>
          state.filterStatus === 'available' ? !book.isRented : book.isRented
        )
      }

      state.filteredBooks = filtered
    },
    addToWishlist: (state, action: PayloadAction<{ bookId: number; userId: number }>) => {
      const { bookId, userId } = action.payload

      // Initialize user's wishlist if it doesn't exist
      if (!state.userWishlists[userId]) {
        state.userWishlists[userId] = []
      }

      // Add book to user's specific wishlist
      if (!state.userWishlists[userId].includes(bookId)) {
        state.userWishlists[userId].push(bookId)
        localStorage.setItem('userWishlists', JSON.stringify(state.userWishlists))
      }
    },
    removeFromWishlist: (state, action: PayloadAction<{ bookId: number; userId: number }>) => {
      const { bookId, userId } = action.payload

      if (state.userWishlists[userId]) {
        state.userWishlists[userId] = state.userWishlists[userId].filter(id => id !== bookId)
        localStorage.setItem('userWishlists', JSON.stringify(state.userWishlists))
      }
    },
    rentBook: (state, action: PayloadAction<{ bookId: number; userId: number }>) => {
      const book = state.books.find(b => b.id === action.payload.bookId)
      if (book && !book.isRented) {
        const now = new Date()
        const dueDate = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours from now

        book.isRented = true
        book.rentedBy = action.payload.userId
        book.rentedAt = now.toISOString()
        book.dueAt = dueDate.toISOString()

        // Update filtered books as well
        const filteredBook = state.filteredBooks.find(b => b.id === action.payload.bookId)
        if (filteredBook) {
          filteredBook.isRented = true
          filteredBook.rentedBy = action.payload.userId
          filteredBook.rentedAt = now.toISOString()
          filteredBook.dueAt = dueDate.toISOString()
        }

        booksSlice.caseReducers.applyFilters(state)
      }
    },
    returnBook: (state, action: PayloadAction<number>) => {
      const book = state.books.find(b => b.id === action.payload)
      if (book && book.isRented) {
        book.isRented = false
        book.rentedBy = undefined
        book.rentedAt = undefined
        book.dueAt = undefined

        // Update filtered books as well
        const filteredBook = state.filteredBooks.find(b => b.id === action.payload)
        if (filteredBook) {
          filteredBook.isRented = false
          filteredBook.rentedBy = undefined
          filteredBook.rentedAt = undefined
          filteredBook.dueAt = undefined
        }

        booksSlice.caseReducers.applyFilters(state)
      }
    },

    syncBooksWithRentals: (state, action: PayloadAction<{ id: string; bookId: number; userId: number; rentedAt: string; dueAt: string; returnedAt?: string }[]>) => {
      const activeRentals = action.payload

      // Reset all books to available first
      state.books.forEach(book => {
        book.isRented = false
        book.rentedBy = undefined
        book.rentedAt = undefined
        book.dueAt = undefined
      })

      // Mark books as rented based on active rentals
      activeRentals.forEach(rental => {
        const book = state.books.find(b => b.id === rental.bookId)
        if (book) {
          book.isRented = true
          book.rentedBy = rental.userId
          book.rentedAt = rental.rentedAt
          book.dueAt = rental.dueAt
        }
      })

      booksSlice.caseReducers.applyFilters(state)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.isLoading = false
        state.books = action.payload
        state.filteredBooks = action.payload
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch books'
      })
  },
})

// Selector to get current user's wishlist
export const selectUserWishlist = (state: any, userId: number): number[] => {
  return state.books.userWishlists[userId] || []
}

export const {
  setSearchQuery,
  setFilterStatus,
  addToWishlist,
  removeFromWishlist,
  rentBook,
  returnBook,
  syncBooksWithRentals
} = booksSlice.actions

export default booksSlice.reducer