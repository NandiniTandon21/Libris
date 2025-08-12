import {
  User,
  Heart,
  Trash2,
  Calendar,
  BookOpen,
  ArrowLeft,
  ShoppingCart
} from 'lucide-react'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Separator } from '../components/ui/separator'
import { addRental } from '../store/slices/rentalsSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { removeFromWishlist, rentBook, selectUserWishlist } from '../store/slices/booksSlice'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export default function Wishlist() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.auth)
  const { books } = useAppSelector(state => state.books)
  const { totalPenalties } = useAppSelector(state => state.rentals)

  // Get current user's wishlist
  const userWishlist = useAppSelector(state => user ? selectUserWishlist(state, user.id) : [])

  const wishlistedBooks = books.filter(book => userWishlist.includes(book.id))
  const availableWishlistedBooks = wishlistedBooks.filter(book => !book.isRented)

  const handleRemoveFromWishlist = (bookId: number, bookTitle: string) => {
    if (!user) return

    dispatch(removeFromWishlist({ bookId, userId: user.id }))
    toast.success(`Removed "${bookTitle}" from wishlist`)
  }

  const handleRentBook = (bookId: number, bookTitle: string) => {
    if (totalPenalties > 50) {
      toast.error('Cannot rent books with unpaid penalties over ₹50')
      return
    }

    if (user) {
      dispatch(rentBook({ bookId, userId: user.id }))
      dispatch(addRental({ bookId, bookTitle, userId: user.id }))

      // Note: Statistics are now calculated in real-time from rental data

      toast.success(`Successfully rented "${bookTitle}"`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
            <Heart className="w-8 h-8 text-red-600" />
            <span>My Wishlist</span>
          </h1>
          <p className="text-gray-600">Books you've saved for later</p>
        </div>
        <Link to="/">
          <Button variant="outline" className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Books</span>
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Wishlisted</p>
                <p className="text-2xl font-bold text-gray-900">{wishlistedBooks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">{availableWishlistedBooks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Currently Rented</p>
                <p className="text-2xl font-bold text-gray-900">
                  {wishlistedBooks.filter(book => book.isRented).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {availableWishlistedBooks.length > 0 && totalPenalties <= 50 && (
        <Card className="bg-libris-50 border-libris-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-libris-600" />
                <div>
                  <p className="font-medium text-libris-900">Ready to rent?</p>
                  <p className="text-sm text-libris-700">
                    You have {availableWishlistedBooks.length} available book{availableWishlistedBooks.length !== 1 ? 's' : ''} in your wishlist
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wishlist Books */}
      {wishlistedBooks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-4">Start adding books you'd like to read later</p>
            <Link to="/">
              <Button>Browse Books</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistedBooks.map((book) => (
            <Card
              key={book.id}
              className={`transition-all duration-200 ${
                book.isRented
                  ? 'opacity-60 grayscale'
                  : 'hover:shadow-lg hover:scale-[1.02]'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight line-clamp-2">
                      {book.title}
                    </CardTitle>
                    <CardDescription className="flex items-center space-x-2 mt-2">
                      <User className="w-4 h-4" />
                      <span>{book.author}</span>
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFromWishlist(book.id, book.title)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {book.body}
                </p>

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <Badge variant={book.isRented ? 'destructive' : 'default'}>
                    {book.isRented ? 'Rented' : 'Available'}
                  </Badge>

                  {!book.isRented ? (
                    <Button
                      size="sm"
                      onClick={() => handleRentBook(book.id, book.title)}
                      disabled={totalPenalties > 50}
                      className="bg-gradient-to-r from-libris-950 to-libris-700 hover:from-libris-900 hover:to-libris-600 text-libris-50"
                    >
                      Rent Now
                    </Button>
                  ) : (
                    <div className="text-right">
                      <Badge variant="outline" className="opacity-60">
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

                {book.isRented && book.rentedBy === user?.id && (
                  <div className="mt-3 p-2 bg-libris-50 rounded-lg">
                    <p className="text-xs text-libris-700">
                      This book is currently in your rentals
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}