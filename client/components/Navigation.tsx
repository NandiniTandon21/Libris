import { useState } from 'react'
import {
  X,
  User,
  Menu,
  Heart,
  LogOut,
  Library,
  BookOpen,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { logout } from '../store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectUserWishlist } from '../store/slices/booksSlice'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export default function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector(state => state.auth)
  const { rentals } = useAppSelector(state => state.rentals)

  // Get current user's wishlist safely
  const userWishlist = useAppSelector(state => user ? selectUserWishlist(state, user.id) : [])

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const activeRentals = rentals.filter(rental => !rental.returnedAt && rental.userId === user?.id)

  if (!isAuthenticated || !user) {
    return null
  }

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: BookOpen,
      current: location.pathname === '/',
    },
    {
      name: 'My Rentals',
      href: '/rentals',
      icon: Library,
      current: location.pathname === '/rentals',
      badge: activeRentals.length > 0 ? activeRentals.length : undefined,
    },
    {
      name: 'Wishlist',
      href: '/wishlist',
      icon: Heart,
      current: location.pathname === '/wishlist',
      badge: userWishlist.length > 0 ? userWishlist.length : undefined,
    },
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-libris-950 to-libris-700 p-2 rounded-lg glow-green">
                  <BookOpen className="h-6 w-6 text-libris-50" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-libris-950 to-libris-700 bg-clip-text text-transparent">
                  Libris
                </span>
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      item.current
                        ? 'border-libris-700 text-libris-950'
                        : 'border-transparent text-libris-600 hover:border-libris-500 hover:text-libris-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                    {item.badge && (
                      <Badge className="ml-2 bg-libris-100 text-libris-800 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <div className="sm:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-libris-950 to-libris-700 text-libris-50 text-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile navigation menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${
                      item.current
                        ? 'bg-libris-50 border-libris-700 text-libris-900'
                        : 'border-transparent text-libris-600 hover:bg-libris-50 hover:border-libris-500 hover:text-libris-800'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                    {item.badge && (
                      <Badge className="ml-auto bg-libris-100 text-libris-800 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}