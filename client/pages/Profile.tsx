import { useState, useRef, useEffect } from 'react'
import {
  User,
  Mail,
  Phone,
  Award,
  Globe,
  Upload,
  MapPin,
  Camera,
  Calendar,
  Building,
  BookOpen,
  IndianRupee,
} from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Separator } from '../components/ui/separator'
import { selectUserWishlist } from '../store/slices/booksSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectUserTotalPenaltiesPaid } from '../store/slices/rentalsSlice'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { updateProfilePicture, initUserProfile, selectUserProfile } from '../store/slices/profileSlice'

export default function Profile() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.auth)
  const userProfile = useAppSelector(state => user ? selectUserProfile(state, user.id) : null)
  const { rentals } = useAppSelector(state => state.rentals)

  // Get current user's wishlist
  const userWishlist = useAppSelector(state => user ? selectUserWishlist(state, user.id) : [])

  // Get actual penalties paid from rental data
  const userTotalPenaltiesPaid = useAppSelector(state =>
    user ? selectUserTotalPenaltiesPaid(state, user.id) : 0
  )

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB')
        return
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }

      setIsUploading(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (user) {
          dispatch(updateProfilePicture({ userId: user.id, picture: result }))
        }
        setIsUploading(false)
        toast.success('Profile picture updated successfully!')
      }
      reader.readAsDataURL(file)
    }
  }

  const activeRentals = rentals.filter(rental => !rental.returnedAt && rental.userId === user?.id)
  const completedRentals = rentals.filter(rental => rental.returnedAt && rental.userId === user?.id)

  // Initialize user profile when component mounts
  useEffect(() => {
    if (user) {
      dispatch(initUserProfile(user.id))
    }
  }, [dispatch, user])

  // Calculate real-time statistics based on actual rental data
  const realTimeStats = {
    totalBooksRented: rentals.filter(rental => rental.userId === user?.id).length,
    currentActiveRentals: activeRentals.length,
    totalPenaltiesPaid: userTotalPenaltiesPaid, // Use actual data from rentals
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account information and view your library statistics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={userProfile?.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-libris-950 to-libris-700 text-libris-50 text-lg">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-gray-600">@{user.username}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="mt-2"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? 'Uploading...' : 'Change Photo'}
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>Email</span>
                  </Label>
                  <Input value={user.email} readOnly className="bg-gray-50" />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>Phone</span>
                  </Label>
                  <Input value={user.phone} readOnly className="bg-gray-50" />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span>Website</span>
                  </Label>
                  <Input value={user.website} readOnly className="bg-gray-50" />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span>Company</span>
                  </Label>
                  <Input value={user.company.name} readOnly className="bg-gray-50" />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>Address</span>
                </Label>
                <Input
                  value={`${user.address.street}, ${user.address.suite}, ${user.address.city} ${user.address.zipcode}`}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeRentals.length === 0 && completedRentals.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No rental activity yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {[...activeRentals, ...completedRentals.slice(0, 5)].map((rental) => (
                    <div key={rental.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{rental.bookTitle}</p>
                        <p className="text-sm text-gray-600">
                          Rented on {new Date(rental.rentedAt).toLocaleDateString()}
                        </p>
                        {rental.penaltyPaid > 0 && (
                          <p className="text-xs text-red-600">
                            Penalty paid: ₹{rental.penaltyPaid}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge variant={rental.returnedAt ? 'outline' : 'default'}>
                          {rental.returnedAt ? 'Returned' : 'Active'}
                        </Badge>
                        {rental.penalty > 0 && (
                          <p className="text-xs text-red-600 mt-1">
                            Current penalty: ₹{rental.penalty}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics Sidebar */}
        <div className="space-y-6">
          {/* Library Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-gray-600" />
                <span>Library Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Books Rented</span>
                </div>
                <Badge variant="secondary">{realTimeStats.totalBooksRented}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Active Rentals</span>
                </div>
                <Badge variant="secondary">{realTimeStats.currentActiveRentals}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <IndianRupee className="w-4 h-4 text-red-600" />
                  <span className="text-sm">Penalties Paid</span>
                </div>
                <Badge variant="secondary">₹{realTimeStats.totalPenaltiesPaid}</Badge>
              </div>

              <Separator />

              <div className="text-center">
                <div className="text-2xl font-bold text-libris-800 mb-1">
                  {Math.max(realTimeStats.totalBooksRented * 10 - realTimeStats.totalPenaltiesPaid, 0)}
                </div>
                <div className="text-sm text-gray-600">Library Points</div>
                <p className="text-xs text-gray-500 mt-1">
                  Earn 10 points per book, lose points for penalties
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Wishlist */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-gray-600" />
                  <span>Wishlist</span>
                </div>
                <Badge variant="outline">{userWishlist.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userWishlist.length === 0 ? (
                <p className="text-gray-600 text-sm">No books in wishlist</p>
              ) : (
                <p className="text-gray-600 text-sm">
                  You have {userWishlist.length} book{userWishlist.length !== 1 ? 's' : ''} saved for later
                </p>
              )}
            </CardContent>
          </Card>

          {/* Membership Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-gray-600" />
                <span>Membership</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Badge className="bg-gradient-to-r from-libris-950 to-libris-700 text-libris-50 mb-2">
                  Premium Member
                </Badge>
                <p className="text-sm text-gray-600">
                  Member since {new Date().getFullYear()}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Unlimited rentals • Priority support • Early access
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}