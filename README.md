# Libris - Library Management System

A modern, React-based library management system built with TypeScript, Redux Toolkit, and Tailwind CSS. Libris provides a comprehensive platform for managing book rentals, user profiles, and library statistics with real-time updates.

## 🌟 Features

### 🔐 Authentication System
- **User Login**: Secure authentication using JSONPlaceholder API users
- **Demo Credentials**: Built-in demo accounts for quick testing
- **Persistent Sessions**: Login state maintained across browser sessions
- **Protected Routes**: Automatic redirection for unauthorized access

### 📖 Book Management
- **Dynamic Book Catalog**: Fetches 100 books from JSONPlaceholder API
- **Real-time Search**: Search by title, author, or description
- **Advanced Filtering**: Filter by availability status and categories
- **Book Categories**: Fiction, Technology, Science, and Business
- **Availability Tracking**: Real-time book availability status

### 🏠 Dashboard Features
- **Statistics Overview**: Total books, available books, rented books, wishlist count
- **Penalty Alerts**: Visual warnings for outstanding penalties
- **One-click Rental**: Instant book rental with availability checks
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 📋 Rental Management
- **24-Hour Rental Period**: Books have a 24-hour due date from rental time
- **Real-time Countdown**: Live countdown timers showing time remaining
- **Penalty System**: ₹5 per hour penalty for overdue books
- **Rental History**: Complete tracking of past and current rentals
- **Return Functionality**: Easy book return with one click

### ❤️ Wishlist System
- **Personal Wishlists**: User-specific book wishlists
- **Quick Actions**: Add/remove books from wishlist
- **Wishlist Analytics**: Statistics and availability tracking
- **Rent from Wishlist**: Direct rental from wishlist items

### 👤 User Profile Management
- **Profile Information**: Complete user details display
- **Avatar Management**: Upload and change profile pictures
- **Library Statistics**: Personal reading and rental statistics
- **Activity Timeline**: Recent rental activity with details
- **Membership Status**: Premium membership benefits display

### 📊 Real-time Analytics
- **Live Statistics**: Real-time updates of all metrics
- **Penalty Tracking**: Current and historical penalty information
- **Rental Analytics**: Active vs completed rental tracking
- **Library Points**: Gamified point system (10 points per book, penalties deduct points)

### 🎨 User Interface
- **Modern Design**: Clean, professional interface with custom Libris theme
- **Responsive Layout**: Mobile-first design that works on all devices
- **Interactive Elements**: Smooth animations and hover effects
- **Accessibility**: ARIA labels and keyboard navigation support
- **Error Handling**: Comprehensive error boundaries and user feedback

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Redux Toolkit** - State management with slices and async thunks
- **React Router** - Client-side routing with protected routes
- **Tailwind CSS** - Utility-first CSS framework

### UI Components
- **Shadcn/UI** - High-quality accessible components
- **Lucide React** - Beautiful, customizable icons
- **Sonner** - Elegant toast notifications

### Data & Storage
- **JSONPlaceholder API** - Mock backend for users and books
- **LocalStorage** - Persistent client-side data storage
- **Redux Persist** - State persistence across sessions

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NandiniTandon21/Libris.git
   cd libris
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the application.

### Demo Login Credentials
```
Username: Bret       | Password: any
Username: Antonette  | Password: any
Username: Samantha   | Password: any
```
*Note: For demo purposes, any password works with valid usernames*

## 📱 Application Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn/UI components
│   ├── Navigation.tsx   # Main navigation component
│   ├── ErrorBoundary.tsx
│   ├── Loading.tsx
│   └── ProtectedRoute.tsx
├── pages/               # Page components
│   ├── Login.tsx        # Authentication page
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Rentals.tsx      # My Rentals page
│   ├── Profile.tsx      # User profile page
│   ├── Wishlist.tsx     # Wishlist management
│   └── NotFound.tsx     # 404 error page
├── store/               # Redux store configuration
│   ├── slices/          # Redux slices
│   │   ├── authSlice.ts     # Authentication state
│   │   ├── booksSlice.ts    # Books and wishlist state
│   │   ├── rentalsSlice.ts  # Rental management state
│   │   └── profileSlice.ts  # User profile state
│   ├── hooks.ts         # Typed Redux hooks
│   └── store.ts         # Store configuration
├── utils/               # Utility functions
└── App.tsx              # Main application component
```

## 🔄 Core Workflows

### Book Rental Process
1. User browses available books on Dashboard
2. Clicks "Rent Book" button
3. System checks for outstanding penalties (>₹50 blocks rental)
4. Book is marked as rented with 24-hour due date
5. Real-time countdown begins
6. Book becomes unavailable to other users

### Penalty System
1. Books become overdue after 24 hours
2. Penalty calculated at ₹5 per hour
3. Real-time penalty updates every second
4. Penalties block new rentals when >₹50
5. Users can pay penalties from My Rentals page

### Wishlist Management
1. Users add books to personal wishlist
2. Wishlist syncs across all pages
3. Direct rental available from wishlist
4. Real-time availability updates

## 📊 State Management

### Redux Store Structure
```typescript
{
  auth: {
    user: User | null,
    isAuthenticated: boolean,
    isLoading: boolean,
    error: string | null
  },
  books: {
    books: Book[],
    filteredBooks: Book[],
    userWishlists: { [userId]: bookId[] },
    searchQuery: string,
    filterStatus: 'all' | 'available' | 'rented'
  },
  rentals: {
    rentals: Rental[],
    totalPenalties: number
  },
  profile: {
    userProfiles: { [userId]: ProfileData }
  }
}
```

### Data Persistence
- **User Authentication**: Stored in localStorage
- **Rental Data**: Persistent across sessions
- **Wishlist Data**: User-specific localStorage
- **Profile Pictures**: Base64 encoded in localStorage

## 🎯 Key Features Deep Dive

### Real-time Updates
- **Countdown Timers**: Update every second showing exact time remaining
- **Penalty Calculations**: Live penalty computation for overdue books
- **Availability Sync**: Instant updates when books are rented/returned
- **Statistics Refresh**: Real-time dashboard metrics

### Responsive Design
- **Mobile-first**: Optimized for small screens
- **Tablet Support**: Adaptive layout for medium screens
- **Desktop Experience**: Full-featured interface for large screens
- **Touch-friendly**: Large buttons and touch targets

### Error Handling
- **Error Boundaries**: Graceful error recovery
- **API Failures**: Retry mechanisms and fallbacks
- **Validation**: Form validation with user feedback
- **Network Issues**: Offline state handling

## 🔒 Security Features

- **Route Protection**: Authenticated routes only
- **Input Validation**: XSS prevention and data sanitization
- **Safe HTML**: No dangerouslySetInnerHTML usage
- **Data Encryption**: Secure data storage practices

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading of components
- **Memoization**: React.memo for expensive components
- **Efficient Selectors**: Optimized Redux selectors
- **Image Optimization**: Efficient avatar loading
- **Bundle Size**: Tree shaking and minification

## 🧪 Testing Strategy

### Test Coverage Areas
- **Unit Tests**: Individual component testing
- **Integration Tests**: Redux store interactions
- **E2E Tests**: Complete user workflows
- **Accessibility Tests**: WCAG compliance testing

## 📈 Future Enhancements

### Planned Features
- **Book Reviews**: User rating and review system
- **Advanced Search**: ISBN, genre, and publication date filters
- **Notifications**: Email/SMS reminders for due dates
- **Admin Panel**: Library staff management interface
- **Reports**: Detailed analytics and reporting
- **Mobile App**: React Native mobile application

### Technical Improvements
- **Backend Integration**: Replace JSONPlaceholder with real API
- **Database**: Persistent data storage
- **Authentication**: JWT-based secure authentication
- **File Upload**: Cloud storage for profile pictures
- **Real-time Updates**: WebSocket connections

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript strict mode
- Use ESLint and Prettier for code formatting
- Write tests for new features
- Update documentation for changes
- Follow conventional commit messages

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

- **Developer**: Nandini Tandon
- **Email**: [tandon.nan.21@gmail.com](mailto:tandon.nan.21@gmail.com)
- **GitHub**: [NandiniTandon21](https://github.com/NandiniTandon21)

## 🙏 Acknowledgments

- **JSONPlaceholder** - Mock API service
- **Shadcn/UI** - Component library
- **Tailwind CSS** - Styling framework
- **Lucide** - Icon library
- **React Community** - Inspiration and best practices

## 📞 Support

For support, email tandon.nan.21@gmail.com or create an issue in the GitHub repository.

---

*Building the future of library management, one book at a time.*