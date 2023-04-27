import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Button, Typography, Paper } from '@mui/material';
import { auth } from './backend/FirebaseConfig';
import { signOut } from 'firebase/auth';
import LogoutIcon from '@mui/icons-material/Logout';
import { Navigate, useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
    const navigate = useNavigate();
    const [status, setStatus] = useState('Not Connected');
    const [uploadedFiles, setUploadedFiles] = useState([]);

    useEffect(() => {

    }, [uploadedFiles]);

    if (!(sessionStorage.getItem('isLoggedIn') === 'true')) {
        return <Navigate to="/" />;
    }

    const handleLogout = async () => {
        sessionStorage.setItem('isLoggedIn', false);
        await signOut(auth);
        navigate('/');
    };

    const openConnection = () => {
        setStatus('Connected');
    };

    const closeConnection = () => {
        setStatus('Not Connected');
    };

    const openFile = () => {
        document.getElementById('fileInput').click();
    };

    const deleteFile = () => {
        if (uploadedFiles.length === 0) {
            alert('no runs to delete');
        }
        else {
            const fileName = uploadedFiles[uploadedFiles.length - 1];
            setUploadedFiles(uploadedFiles.pop());
            alert(`run ${fileName} deleted`);
        }
    };

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        const fileName = file.name;
        uploadedFiles.push(fileName);
        alert(`run ${fileName} uploaded`);
    };

    return (
        <>
        <div className="container">
            <div className="app-bar-container">
                <AppBar position="fixed" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                    <Toolbar sx={{ padding: 0, margin: 0 }}>
                        <IconButton edge="start" color="inherit" aria-label="logout" onClick={handleLogout}>
                            <LogoutIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </div>
            <div className="content">
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

                    <Typography variant="h2" sx={{ marginTop: '1rem', marginBottom: '1rem' }}>SlayTheSpireStats</Typography>
                    <Typography variant="h4" sx={{ marginTop: '1rem', marginBottom: '1rem' }}>{status}</Typography>
                    <div className="buttons">
                        <Button variant="contained" onClick={closeConnection}>Close Connection</Button>
                        <Button variant="contained" onClick={openConnection}>Open Connection</Button>
                    </div>
                    <div className="buttons2">
                        <Button variant="contained" onClick={deleteFile}>Delete Most Recent Run</Button>
                        <input id="fileInput" type="file" accept="text/plain" onChange={handleFileInputChange} style={{ display: 'none' }} />
                        <Button variant="contained" onClick={openFile}>Upload Run</Button>
                    </div>
                </Paper>
            </div>
        </div>
        </>
    );
}

export default Home;
