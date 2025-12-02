# User Accounts Management System

A modern React application for managing user authentication and account profiles. Built with clean architecture principles, comprehensive form validation, and a responsive UI powered by Bootstrap.

## Overview

This application provides a complete user account management experience with email-based authentication, account verification, and profile management capabilities. Users can register with email verification, log in securely, and update their account information with real-time validation.

## Features

### Authentication
- **User Registration** - Multi-step registration with email verification
- **Email Verification** - Secure email verification with 6-digit codes
- **Login** - Secure login with email and password
- **Session Management** - Token-based authentication stored in localStorage

### Account Management
- **Profile View** - Display user account information in a clean card layout
- **Profile Editing** - Edit personal details including name, phone, DOB, and address
- **Real-time Validation** - Instant feedback as users fill out forms
- **Responsive Design** - Works seamlessly on desktop and mobile devices

### User Experience
- **Navigation Bar** - Dynamic navbar showing user status and quick logout option
- **Inline Error Handling** - Clear, contextual error messages for all operations
- **Loading States** - Loading indicators during async operations
- **Form Validation** - Client-side validation with visual feedback (success/error states)

## Tech Stack

- **Frontend Framework**: React 19.2.0
- **Routing**: React Router DOM 7.9.6
- **Styling**: Bootstrap 5.3.8
- **Build Tool**: Vite 7.2.4
- **Code Quality**: ESLint with React Hooks support

## Project Structure

```
src/
├── components/              # React components
│   ├── Account.jsx         # Profile viewing and editing
│   ├── Login.jsx           # Login form
│   ├── Register.jsx        # Multi-step registration
│   ├── Navbar.jsx          # Navigation bar
│   └── FormInput.jsx       # Reusable form input component
├── hooks/                  # Custom React hooks
│   ├── useAsync.js         # Async operation state management
│   └── useFormValidation.js# Form validation logic
├── services/               # API integration
│   └── authApi.js          # Authentication API calls
├── utils/                  # Utility functions
│   ├── validators.js       # Input validation functions
│   └── classNames.js       # className builder utilities
├── App.jsx                 # Main app component with routing
├── main.jsx                # React entry point
└── index.css               # Global styles
```

## Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd userAccounts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment** (if needed)
   - The API endpoint is configured in `src/services/authApi.js`
   - Update `BASE_URL` if using a different backend

### Running the Application

**Development server:**
```bash
npm run dev
```
The app will be available at `https://inter-frontend-liard.vercel.app/`

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

**Lint code:**
```bash
npm run lint
```

## API Integration

The application connects to a backend API for authentication. The API endpoint is configured at:
```
https://inter-backend-pi.vercel.app
```

### API Endpoints

- `POST /send-code` - Send verification code to email
- `POST /verify-email` - Verify email with code
- `POST /register` - Create new user account
- `POST /login` - Login user
- `GET /account` - Get current user profile
- `PUT /account` - Update user profile

## Key Components

### Account Component
Displays and manages user profile information. Features include viewing account details, editing profile information with validation, and logout functionality.

### Register Component
Multi-step registration flow:
1. Enter email and receive verification code
2. Verify email with 6-digit code
3. Complete profile with personal details

### Login Component
Simple login form with email and password validation, including error handling and loading states.

### Navbar Component
Dynamic navigation bar that shows:
- User greeting when logged in
- Account link for logged-in users
- Login/Register links for guest users
- Responsive hamburger menu for mobile

## Custom Hooks

### useAsync
Manages async operation state (loading, error, data). Automatically handles loading and error states for API calls.

```javascript
const { loading, error, execute, clearError } = useAsync(apiFunction);
```

### useFormValidation
Manages form field validation state and provides validation utilities.

```javascript
const { touched, handleBlur, getFieldError, getFieldStatus, isFieldValid } = 
  useFormValidation(validatorObject);
```

## Validation

All form inputs are validated using centralized validators in `src/utils/validators.js`:

- **Email**: Must contain @ and . characters
- **Password**: Minimum 3 characters
- **Name Fields**: Minimum 2 characters (trimmed)
- **Verification Code**: Exactly 6 digits

## Styling

The application uses Bootstrap 5 for styling with custom CSS overrides in `App.css`. All components are responsive and mobile-friendly.

## Error Handling

- Network errors are caught and displayed to users
- API errors include helpful messages
- Form validation errors appear inline below fields
- Authentication errors redirect to login
- Session expiration is handled gracefully

## Code Quality

- **ESLint Configuration**: Enforces React best practices and hooks rules
- **Component Structure**: Clean, functional components with proper hook usage
- **Code Organization**: Separation of concerns with dedicated utilities and services
- **Naming Conventions**: Clear, descriptive names for variables and functions

## Browser Support

Tested and working on:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Password reset functionality
- Two-factor authentication
- User profile picture upload
- Password strength indicator
- Social login integration
- Account deletion
- Activity logging

## Troubleshooting

### Infinite Loading on Account Page
- Ensure authentication token is valid in localStorage
- Check that API endpoint is accessible
- Verify network connection

### Form Validation Not Working
- Check browser console for errors
- Ensure validators are properly imported
- Verify input field values match expected format

### Logout Not Working
- Clear browser localStorage manually
- Check that logout handler is properly bound
- Verify routing configuration

## License

This project is provided as-is for educational and development purposes.

## Support

For issues or questions, please check the API endpoint connectivity and verify all environment variables are correctly configured.
