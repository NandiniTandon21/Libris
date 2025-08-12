import {
  User,
  Heart,
  Search,
  Filter,
  BookOpen,
  TrendingUp,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Input } from '../components/ui/input'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Separator } from '../components/ui/separator'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { addRental, updatePenalties, selectUserCurrentPenalties } from '../store/slices/rentalsSlice'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { fetchBooks, setSearchQuery, setFilterStatus, addToWishlist, removeFromWishlist, rentBook, syncBooksWithRentals, selectUserWishlist } from '../store/slices/booksSlice'

export default function Dashboard() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.auth)
  const { filteredBooks, isLoading, searchQuery, filterStatus } = useAppSelector(state => state.books)
  const { rentals } = useAppSelector(state => state.rentals)

  const userCurrentPenalties = useAppSelector(state =>
    user ? selectUserCurrentPenalties(state, user.id) : 0
  )

  // Get current user's wishlist using the selector
  const userWishlist = useAppSelector(state => user ? selectUserWishlist(state, user.id) : [])

  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    dispatch(fetchBooks()).then(() => {
      // Sync books with current rentals after fetching
      const activeRentals = rentals.filter(rental => !rental.returnedAt)
      dispatch(syncBooksWithRentals(activeRentals))
    })

    // Update penalties when component mounts
    dispatch(updatePenalties())

    // Set up interval to update penalties every minute
    const interval = setInterval(() => {
      dispatch(updatePenalties())
    }, 60000)

    return () => clearInterval(interval)
  }, [dispatch])

  // Sync books with rentals whenever rentals change
  useEffect(() => {
    const activeRentals = rentals.filter(rental => !rental.returnedAt)
    dispatch(syncBooksWithRentals(activeRentals))
  }, [dispatch, rentals])

  // Real-time penalty update effect
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(updatePenalties())
    }, 30000) // Update every 30 seconds for more real-time feel

    return () => clearInterval(interval)
  }, [dispatch])

  const handleRentBook = (bookId: number, bookTitle: string) => {
    // user-specific penalties for blocking check
    if (userCurrentPenalties > 50) {
      toast.error('Cannot rent books with unpaid penalties over ₹50')
      return
    }

    if (user) {
      // First update the books state
      dispatch(rentBook({ bookId, userId: user.id }))
      // Then add to rentals
      dispatch(addRental({ bookId, bookTitle, userId: user.id }))

      toast.success(`Successfully rented "${bookTitle}"`)
    }
  }

  const handleWishlistToggle = (bookId: number, bookTitle: string) => {
    if (!user) return

    if (userWishlist.includes(bookId)) {
      dispatch(removeFromWishlist({ bookId, userId: user.id }))
      toast.success(`Removed "${bookTitle}" from wishlist`)
    } else {
      dispatch(addToWishlist({ bookId, userId: user.id }))
      toast.success(`Added "${bookTitle}" to wishlist`)
    }
  }

  const getBooksByCategory = () => {
    if (selectedCategory === 'all') return filteredBooks
    const categoryMap: { [key: string]: number[] } = {
      'fiction': [1, 2, 3, 4, 5],
      'technology': [6, 7, 8, 9, 10],
      'science': [11, 12, 13, 14, 15],
      'business': [16, 17, 18, 19, 20],
    }
    return filteredBooks.filter(book => categoryMap[selectedCategory]?.includes(book.userId))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-libris-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Library Dashboard</h1>
          <p className="text-gray-600">Discover and rent your next favorite book</p>
        </div>
      </div>

      {/* Penalty Alert - Only shows when penalties exist */}
      {userCurrentPenalties > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">Outstanding Penalties: ₹{userCurrentPenalties}</p>
                  <p className="text-sm text-red-700">
                    {userCurrentPenalties > 50 ? 'Rentals are blocked until penalties are paid.' : 'Please pay your penalties soon.'}
                  </p>
                </div>
              </div>
              <Link to="/rentals">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Manage Penalties
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search books by title, author, or description..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="pl-10 border-gray-200 focus:border-libris-500 focus:ring-libris-500"
            />
          </div>
        </div>

        <Select value={filterStatus} onValueChange={(value: any) => dispatch(setFilterStatus(value))}>
          <SelectTrigger className="border-gray-200 focus:border-libris-500 focus:ring-libris-500">
            <Filter className="w-4 h-4 mr-2 text-gray-500" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Books</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="rented">Rented</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="border-gray-200 focus:border-libris-500 focus:ring-libris-500">
            <BookOpen className="w-4 h-4 mr-2 text-gray-500" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="fiction">Fiction</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="business">Business</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats - Using different colors for better distinction */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{filteredBooks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredBooks.filter(book => !book.isRented).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Rented</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredBooks.filter(book => book.isRented).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Heart className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">My Wishlist</p>
                <p className="text-2xl font-bold text-gray-900">{userWishlist.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getBooksByCategory().map((book) => (
          <Card
            key={book.id}
            className={`transition-all duration-200 border-gray-200 hover:border-libris-300 ${
              book.isRented
                ? 'opacity-60 grayscale hover:opacity-70 cursor-not-allowed'
                : 'hover:shadow-lg hover:scale-[1.02] bg-white'
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg leading-tight line-clamp-2 text-gray-900">
                    {book.title}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-2 mt-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{book.author}</span>
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleWishlistToggle(book.id, book.title)}
                  className={`${
                    userWishlist.includes(book.id)
                      ? 'text-pink-600 hover:text-pink-700 hover:bg-pink-50'
                      : 'text-gray-400 hover:text-pink-600 hover:bg-pink-50'
                  }`}
                >
                  <Heart className="w-4 h-4" fill={userWishlist.includes(book.id) ? 'currentColor' : 'none'} />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {book.body}
              </p>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <Badge
                  variant={book.isRented ? 'destructive' : 'default'}
                  className={book.isRented ? '' : 'bg-green-100 text-green-800 hover:bg-green-200'}
                >
                  {book.isRented ? 'Rented' : 'Available'}
                </Badge>

                {!book.isRented ? (
                  <Button
                    size="sm"
                    onClick={() => handleRentBook(book.id, book.title)}
                    disabled={userCurrentPenalties > 50}
                    className="bg-gradient-to-r from-libris-950 to-libris-700 hover:from-libris-900 hover:to-libris-600 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    Rent Book
                  </Button>
                ) : (
                  <div className="text-right">
                    <Badge variant="outline" className="opacity-60 border-gray-300 text-gray-600">
                      {book.rentedBy === user?.id ? 'Rented by You' : `Rented by User ${book.rentedBy}`}
                    </Badge>
                    {book.dueAt && (
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {new Date(book.dueAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {getBooksByCategory().length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}