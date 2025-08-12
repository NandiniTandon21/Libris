import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { Alert, AlertDescription } from '../components/ui/alert'
import { loginUser, clearError } from '../store/slices/authSlice'
import { BookOpen, User, Lock, AlertCircle, Leaf, BookOpenCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { isLoading, error, isAuthenticated } = useAppSelector(state => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (username && password) {
      await dispatch(loginUser({ username, password }))
    }
  }

  const handleInputChange = () => {
    if (error) {
      dispatch(clearError())
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center libris-gradient hero-pattern p-4">
      {/* Floating elements for visual appeal */}
      <div className="absolute top-20 left-20 animate-float">
        <Leaf className="w-6 h-6 text-libris-700 opacity-20" />
      </div>
      <div className="absolute top-40 right-32 animate-float" style={{ animationDelay: '1s' }}>
        <BookOpenCheck className="w-8 h-8 text-libris-600 opacity-20" />
      </div>
      <div className="absolute bottom-32 left-32 animate-float" style={{ animationDelay: '2s' }}>
        <BookOpen className="w-5 h-5 text-libris-800 opacity-20" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="bg-gradient-to-r from-libris-950 to-libris-700 p-6 rounded-full shadow-2xl glow-green">
                <BookOpen className="w-12 h-12 text-libris-50" />
              </div>
              <div className="absolute -top-2 -right-2 bg-libris-500 rounded-full p-2">
                <Leaf className="w-4 h-4 text-libris-50" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-libris-950 to-libris-700 bg-clip-text text-transparent">
              Libris
            </span>
          </h1>
          <p className="text-libris-800 text-lg font-medium mb-2">Your Digital Library Sanctuary</p>
          <p className="text-libris-600">Discover, rent, and manage your literary journey</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm relative overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-libris-950 via-libris-700 to-libris-500"></div>

          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-libris-950">Welcome Back</CardTitle>
            <CardDescription className="text-libris-600">
              Sign in to access your personal library
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-libris-800">
                  Username or Email
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-3 h-4 w-4 text-libris-400 group-focus-within:text-libris-600 transition-colors" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      handleInputChange()
                    }}
                    className="pl-10 border-libris-200 focus:border-libris-500 focus:ring-libris-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-libris-800">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-libris-400 group-focus-within:text-libris-600 transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      handleInputChange()
                    }}
                    className="pl-10 border-libris-200 focus:border-libris-500 focus:ring-libris-500"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-libris-950 to-libris-700 hover:from-libris-900 hover:to-libris-600 text-libris-50 font-medium py-3 transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-libris-50"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In to Libris'
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 p-4 bg-libris-50 border border-libris-100 rounded-lg">
              <h4 className="text-sm font-medium text-libris-900 mb-3 flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Demo Credentials
              </h4>
              <div className="text-xs text-libris-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span>Username:</span>
                  <code className="bg-libris-100 text-libris-800 px-2 py-1 rounded font-mono">Bret</code>
                </div>
                <div className="flex items-center justify-between">
                  <span>Username:</span>
                  <code className="bg-libris-100 text-libris-800 px-2 py-1 rounded font-mono">Antonette</code>
                </div>
                <div className="flex items-center justify-between">
                  <span>Username:</span>
                  <code className="bg-libris-100 text-libris-800 px-2 py-1 rounded font-mono">Samantha</code>
                </div>
                <div className="text-libris-600 mt-3 text-center border-t border-libris-200 pt-2">
                  Password: Any password works for demo
                </div>
              </div>
            </div>

            {/* Features Preview */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center space-y-1">
                <div className="bg-libris-100 p-2 rounded-lg">
                  <BookOpen className="w-4 h-4 text-libris-700" />
                </div>
                <span className="text-xs text-libris-600">Browse Books</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="bg-libris-100 p-2 rounded-lg">
                  <BookOpenCheck className="w-4 h-4 text-libris-700" />
                </div>
                <span className="text-xs text-libris-600">Track Rentals</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="bg-libris-100 p-2 rounded-lg">
                  <User className="w-4 h-4 text-libris-700" />
                </div>
                <span className="text-xs text-libris-600">Manage Profile</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-libris-600 text-sm">
            Welcome to Libris - Where stories come alive
          </p>
        </div>
      </div>
    </div>
  )
}