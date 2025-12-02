# User Accounts Management App

A React application (V16+) for creating and managing user accounts. Built with Vite, React Router, and Bootstrap.

## Features

- **Login Page**: Authenticate existing users
- **Registration Page**: Create new user accounts
- **Account Management Page**: View and edit user information
- **Responsive Design**: Uses Bootstrap for styling
- **Local Storage**: User data stored in browser's local storage

## Tech Stack

- React 19.2.0
- Vite
- React Router DOM
- Bootstrap 5
- ESLint

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd userAccounts
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal)

## Usage

1. **Register**: Create a new account by providing name, email, and password
2. **Login**: Use your email and password to log in
3. **Manage Account**: View and edit your account information, or logout

## Project Structure

```
src/
├── components/
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Account.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## Evaluation Criteria

- **Functionality**: All specified requirements are met
- **Code Quality**: Code is well-organized, maintainable, and uses appropriate comments
- **Error Handling**: Application handles errors gracefully (e.g., duplicate email registration)
- **Documentation**: Clear and informative README

## Notes

- User data is stored in localStorage for simplicity
- No backend server is required
- Basic styling with Bootstrap; focus on functionality over design
