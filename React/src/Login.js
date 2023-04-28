import React, { useState, forwardRef } from 'react';
import { Box, TextField, Button, Snackbar, Paper } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import { auth } from './backend/FirebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import MuiAlert from '@mui/material/Alert';
import './Login.css'

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [severity, setSeverity] = useState('error');
    const navigate = useNavigate();

    const Alert = forwardRef((props, ref) => {
        return <MuiAlert ref={ref} elevation={6} variant="filled" {...props} />;
    });

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
        return <Navigate to="/home"/>;
    }

    const handleUsernameChange = event => setEmail(event.target.value);
    const handlePasswordChange = event => setPassword(event.target.value);

    const handleSubmit = async (event) => {
        event.preventDefault();
        await signInWithEmailAndPassword(auth, email, password)
            .then(async () => {
                if (!auth.currentUser.emailVerified) {
                    showSnackbar('Please verify your email before logging in.');
                    return;
                }
                setSeverity('success');
                showSnackbar('Successful login!');
                sessionStorage.setItem('username', email);

                setTimeout(() => {
                    navigate('/home');
                    sessionStorage.setItem('isLoggedIn', true);
                }, 1750);
            })
            .catch((error) => {
                console.log(error.code);
                if (error.code === 'auth/invalid-email') {
                    showSnackbar("Invalid email.");
                } else if (error.code === 'auth/user-not-found') {
                    showSnackbar("User not found.");
                } else if (error.code === 'auth/missing-password') {
                    showSnackbar("Please enter your password.");
                } else if (error.code === 'auth/wrong-password') {
                    showSnackbar("Incorrect password.");
                } else {
                    showSnackbar("An unexpected error has occurred. Please reload and try again.");
                }
            })
    };

    const handleForgotPassword = async () => {
        if (email === '') {
            showSnackbar('Please enter your email address to reset your password.');
        } else {
            try {
                await sendPasswordResetEmail(auth, email);
                setSeverity('success');
                showSnackbar('A password reset email has been sent to your email address.');
            } catch (error) {
                console.log(error.code)
                if (error.code === 'auth/invalid-email') {
                    showSnackbar("Please enter a valid email.");
                } else if (error.code === 'auth/user-not-found') {
                    showSnackbar("User not found.");
                } else {
                    showSnackbar('An error occurred while sending the password reset email. Please try again.');
                }
            }
        }
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
                    <h1>Log in</h1>
                    <a href="/signup">
                        Don't have an account?
                    </a>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem'}}>
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
                            <Button type="submit" variant="contained" sx={{marginTop: '1rem'}}>
                                Submit
                            </Button>
                            <Button
                                variant="text"
                                color="secondary"
                                onClick={handleForgotPassword}
                                sx={{marginTop: '1rem'}}
                            >
                                Forgot Password?
                            </Button>
                        </Box>
                    </form>
                </Paper>
                <Snackbar open={snackbarOpen} autoHideDuration={4500} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={severity}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </div>
    );
};

export default Login;
