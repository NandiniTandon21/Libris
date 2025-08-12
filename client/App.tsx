import Login from './pages/Login'
import { store } from './store/store'
import Rentals from './pages/Rentals'
import Profile from './pages/Profile'
import { Provider } from 'react-redux'
import Wishlist from './pages/Wishlist'
import NotFound from './pages/NotFound'
import Dashboard from './pages/Dashboard'
import { Toaster } from './components/ui/sonner'
import Navigation from './components/Navigation'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div>
                      <Navigation />
                      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/wishlist" element={<Wishlist />} />
                          <Route path="/rentals" element={<Rentals />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          <Toaster />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  )
}

export default App
