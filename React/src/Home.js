import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Button, Typography, Paper } from '@mui/material';
import { auth } from './backend/FirebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc, getFirestore } from 'firebase/firestore';
import LogoutIcon from '@mui/icons-material/Logout';
import { Navigate, useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
    const firestore = getFirestore();
    const navigate = useNavigate();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [username, setUsername] = useState("");
    const [userType, setUserType] = useState("");
    const [data, setData] = useState({
        Gold: 0,
        Floor: 0,
        GamesPlayed: 0,
        Name: ""
    });


    useEffect(() => {

    }, [uploadedFiles]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userEmail = user.email;
                const userDoc = await getDoc(doc(firestore, "users", userEmail));
                setUsername(userDoc.data().username);
                setUserType(userDoc.data().userType);

                fetch("/all").then((res) =>
                    res.json().then((data) => {
                        setData({
                            Gold: Math.round(data.Gold),
                            Floor: Math.round(data.Floor),
                            GamesPlayed: data.GamesPlayed,
                            Name: data.Name
                        });
                    })
                );
            } else {
                navigate("/");
            }
        });

        return () => {
            unsubscribe();
        };
    }, [navigate]);

    if (!(sessionStorage.getItem('isLoggedIn') === 'true')) {
        return <Navigate to="/" />;
    }

    const handleLogout = async () => {
        sessionStorage.setItem('isLoggedIn', false);
        await signOut(auth);
        navigate('/');
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
                <Typography variant="h2" color='Black' sx={{ marginTop: '1rem', marginBottom: '1rem' }}>SlayTheSpireStats</Typography>
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

                        <Typography variant="h2" sx={{ marginTop: '1rem', marginBottom: '1rem' }}>{username}'s stats:</Typography>
                        <Typography variant="h4" color='Black' sx={{ marginBottom: '1rem' }}>{userType === "admin" ? "Admin" : "Not admin"}</Typography>
                        <Typography>Games Played: {data.GamesPlayed}</Typography>
                        <Typography>Average Gold Achieved: {data.Gold}</Typography>
                        <Typography>Average Floor Reached: {data.Floor}</Typography>'

                        <div className="buttons">
                            <Button variant="contained" onClick={deleteFile} sx={{marginBottom: '1rem'}}>Delete Most Recent Run</Button>
                            <input id="fileInput" type="file" accept="text/plain" onChange={handleFileInputChange} style={{ display: 'none' }} />
                            <Button variant="contained" sx={{marginBottom: '1rem'}} onClick={openFile}>Upload Run</Button>
                        </div>
                    </Paper>
                </div>
            </div>
        </>
    );
}

export default Home;
