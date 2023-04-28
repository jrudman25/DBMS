import React, { useState, forwardRef } from 'react';
import { Box, TextField, Button, Snackbar, Typography, Checkbox, FormControlLabel, Paper } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import { db, auth } from './backend/FirebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, sendEmailVerification  } from "firebase/auth";
import MuiAlert from '@mui/material/Alert';
import './Signup.css'

let user = {
    email: "",
    username: "",
    userType: ""
}

const Signup = () => {

    const [email, setEmail] = useState('');
    const [userType, setUserType] = useState('user');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [severity, setSeverity] = useState('error');
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    const Alert = forwardRef((props, ref) => {
        return <MuiAlert ref={ref} elevation={6} variant="filled" {...props} />;
    });

    const handleAdminCheckboxChange = event => {
        setIsAdmin(event.target.checked);
        setUserType(event.target.checked ? 'admin' : 'user');
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const showSnackbar = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        return <Navigate to="/home" />;
    }

    const handleUsernameChange = event => setEmail(event.target.value);
    const handlePasswordChange = event => setPassword((event.target.value));
    const handlePasswordConfirmChange = event => setPasswordConfirm((event.target.value));

    const handleSubmit = async event => {
        event.preventDefault();
        if (password !== passwordConfirm) {
            setSeverity('warning');
            showSnackbar("Passwords do not match!");
            return;
        }
        user.username = email.substring(0, email.lastIndexOf('@'));
        await createUserWithEmailAndPassword(auth, email, password)
            .then(async (cred) => {
                // Send email verification
                await sendEmailVerification(cred.user).then(() => {
                    setSeverity('success');
                    showSnackbar("Successfully created account! Please check your email for verification.");
                }).catch(() => {
                    setSeverity('error');
                    showSnackbar("An error occurred while sending the verification email. Please try again.");
                });
                user.email = email;
                user.userType = userType;
                await setDoc(doc(db, 'users', email), user);
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }).catch((error) => {
                if (error.code === 'auth/invalid-email' || error.code === 'auth/missing-email') {
                    setSeverity('warning');
                    showSnackbar("Please enter a valid email.");
                }
                else if (error.code === 'auth/email-already-in-use') {
                    setSeverity('warning');
                    showSnackbar("This email is already in use. Please sign up with a different email.");
                }
                else if (error.code === 'auth/weak-password' || password === '') {
                    setSeverity('warning');
                    showSnackbar("Please create a password that meets the specifications below.");
                }
                else {
                    setSeverity('error');
                    showSnackbar("An unexpected error has occurred. Please reload and try again.");
                }
            });
    };

    return (
        <div className="container">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minHeight: '100vh',
                    justifyContent: 'center'
                }}
            >
                <Paper
                    elevation={2}
                    sx={{
                        padding: '2rem',
                        borderRadius: '0.5rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.91)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <h1>Sign-up</h1>
                    <a href="/">
                        Already have an account?
                    </a>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem' }}>
                            <TextField
                                id="username"
                                label="Email"
                                type="text"
                                value={email}
                                onChange={handleUsernameChange}
                                sx={{margin: 0.5}}
                            />
                            <TextField
                                id="password"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={handlePasswordChange}
                                sx={{margin: 0.5}}
                            />
                            <TextField
                                id="password-confirm"
                                label="Confirm Password"
                                type="password"
                                value={passwordConfirm}
                                onChange={handlePasswordConfirmChange}
                                sx={{margin: 0.5}}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isAdmin}
                                        onChange={handleAdminCheckboxChange}
                                        inputProps={{ 'aria-label': 'Admin checkbox' }}
                                    />
                                }
                                label="Admin?"
                            />
                            <Button type="submit" variant="contained" sx={{ marginTop: '1rem' }}>
                                Submit
                            </Button>
                        </Box>
                    </form>
                    <Typography sx={{ marginTop: '1rem', marginBottom: '0.01rem' }}>
                        Account Creation Requirements:
                    </Typography>
                    <ul>
                        <li>Valid email</li>
                        <li>Email not already used</li>
                        <li>Password must be at least 6 characters</li>
                        <li>Only check admin if you know what it means</li>
                    </ul>
                </Paper>
            </Box>
            <Snackbar open={snackbarOpen} autoHideDuration={4500} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={severity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Signup;
