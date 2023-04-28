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
    const [imageURL, setImageURL] = useState('');
    const [data, setdata] = useState({
        Gold: 0,
        Floor: 0,
        GamesPlayed: 0,
        Name: ""
    });

    useEffect(() => {

    }, [uploadedFiles]);

    useEffect(() => {
        // Using fetch to fetch the api from 
        // flask server it will be redirected to proxy
        fetch("/all").then((res) =>
            res.json().then((data) => {
                setdata({
                    Gold: data.Gold,
                    Floor: data.Floor,
                    GamesPlayed: data.GamesPlayed,
                    Name: data.Name
                })
                // Setting a data from api
            })
        );
    }, []);

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
                <Typography variant="h2" color='Black' sx={{ marginTop: '1rem', marginBottom: '1rem' }}>{data.Name}'s Stats</Typography>
                <div className="content">
                    <Paper
                        elevation={2}
                        style={{display: 'flex', width: '600px', flexDirection: 'column', alignItems: 'center',}}
                        sx={{
                            padding: '2rem',
                            borderRadius: '0.5rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.91)',
                            display: 'flex',
                            flexDirection: 'column',
                            
                        }}
                    >

                        <Typography variant="h2" sx={{ marginTop: '1rem', marginBottom: '1rem' }}>Average Gold Collected in Runs</Typography>
                        <div className="buttons">
                            <Button variant="contained" onClick={closeConnection}>Close Connection</Button>
                            <Button variant="contained" onClick={openConnection}>Open Connection</Button>
                        </div>
                        <div className="buttons2">
                            <Button variant="contained" onClick={deleteFile}>Delete Most Recent Run</Button>
                            <input id="fileInput" type="file" accept="text/plain" onChange={handleFileInputChange} style={{ display: 'none' }} />
                            <Button variant="contained" onClick={openFile}>Upload Run</Button>
                        </div>

                        <Typography>{data.Name}'s Stats: </Typography>
                        <Typography>Games Played: {data.GamesPlayed}</Typography>
                        <Typography>Average Gold Achieved: {data.Gold}</Typography>
                        <Typography>Average Floor Reached: {data.Floor}</Typography>
                    </Paper>
                    <Paper
                        elevation={2}
                        style={{display: 'flex'}}
                        sx={{
                            padding: '2rem',
                            borderRadius: '0.5rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.91)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        
                        <Typography>Average Gold Achieved: {data.Gold}</Typography>
                        <Typography>Average Floor Reached: {data.Floor}</Typography>
                    </Paper>
                </div>
            </div>
        </>
    );
}

export default Home;
