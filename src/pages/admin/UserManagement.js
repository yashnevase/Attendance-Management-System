import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    TextField,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import api from "../../context/api"

const UserManagement = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState('2');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [users, setUsers] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, [token]);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data.users || []);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await api.post(
                '/users/create',
                { name, username,email, password, role_id: parseInt(roleId) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(response.data.message);
            setName('');
            setUsername('');
            setEmail('');
            setPassword('');
            setRoleId('2');
            fetchUsers(); // Refresh the user list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user');
        }
    };

    const getRoleLabel = (roleId) => {
        switch (roleId) {
            case 1: return 'Admin';
            case 2: return 'Manager';
            case 3: return 'Employee';
            default: return 'Unknown';
        }
    };

    const getRoleColor = (roleId) => {
        switch (roleId) {
            case 1: return 'error';
            case 2: return 'warning';
            case 3: return 'success';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                User Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Create and manage system users
            </Typography>

            <Grid container spacing={3}>
                {/* Create User Form */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Create New User
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            variant="outlined"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Username"
                                            variant="outlined"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            email
                                            label="email"
                                            variant="outlined"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Password"
                                            type="password"
                                            variant="outlined"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel>Role</InputLabel>
                                            <Select
                                                value={roleId}
                                                onChange={(e) => setRoleId(e.target.value)}
                                                label="Role"
                                            >
                                                <MenuItem value="2">Manager</MenuItem>
                                                <MenuItem value="3">Employee</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            startIcon={<Add />}
                                            sx={{ mt: 1 }}
                                        >
                                            Create User
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                            {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
                            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Users List */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Existing Users
                            </Typography>
                            <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Username</TableCell>
                                            {/* <TableCell>Email</TableCell> */}
                                            <TableCell>Role</TableCell>
                                            {/* <TableCell>Actions</TableCell> */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {users.length > 0 ? (
                                            users.map((user) => (
                                                <TableRow key={user.id}>
                                                    <TableCell>{user.name}</TableCell>
                                                    <TableCell>{user.username}</TableCell>
                                                    {/* <TableCell>{user.email}</TableCell> */}
                                                    <TableCell>
                                                        <Chip
                                                            label={getRoleLabel(user.role_id)}
                                                            color={getRoleColor(user.role_id)}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                    {/* <TableCell>
                                                        <IconButton size="small" color="primary">
                                                            <Edit />
                                                        </IconButton>
                                                        <IconButton size="small" color="error">
                                                            <Delete />
                                                        </IconButton>
                                                    </TableCell> */}
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} align="center">
                                                    No users found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default UserManagement;
