import React from 'react';

import AppRoutes from './routes/AppRoutes';

function App() {
    return (
            <AppRoutes />
    );
}

export default App;

















// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from './context/AuthContext';
// import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
// import './App.css';

// function App() {
//   const { user, logout } = useAuth();

//   const handleLogout = () => {
//     logout();
//   };

//   return (
//     <Box sx={{ flexGrow: 1 }}>
//       <AppBar position="static">
//         <Toolbar>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//             Smart Leave & Attendance
//           </Typography>
//           <Button color="inherit" component={Link} to="/">Home</Button>
//           {!user ? (
//             <Button color="inherit" component={Link} to="/login">Login</Button>
//           ) : (
//             <Button color="inherit" onClick={handleLogout}>Logout</Button>
//           )}
//           {user && user.role_id === 1 && <Button color="inherit" component={Link} to="/admin/dashboard">Admin</Button>}
//           {user && user.role_id === 2 && <Button color="inherit" component={Link} to="/manager/dashboard">Manager</Button>}
//           {user && user.role_id === 3 && <Button color="inherit" component={Link} to="/employee/dashboard">Employee</Button>}
//         </Toolbar>
//       </AppBar>
//       <header className="App-header">
//         {/* The content of your App component can be here or removed if it's just a placeholder */}
//         <Typography variant="h4" component="h1" gutterBottom>
//           Welcome to the Smart Leave & Attendance Management System
//         </Typography>
//         {!user && <Typography variant="body1">Please login to continue</Typography>}
//       </header>
//     </Box>
//   );
// }

// export default App;
