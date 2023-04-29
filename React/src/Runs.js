import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { auth } from './backend/FirebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc, getFirestore } from 'firebase/firestore';
import LogoutIcon from '@mui/icons-material/Logout';
import { Navigate, useNavigate } from 'react-router-dom';
import './Runs.css';

function Runs() {
    const firestore = getFirestore();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [userType, setUserType] = useState("");
    const [runs, setruns] = useState({
        Date:[],
        Success:[],
        Duration:[],
        Gold:[],
        MaxFloor:[],
        Username:[]
    });
    const [userruns, setUserRuns] = useState({
        Date:[],
        Success:[],
        Duration:[],
        Gold:[],
        MaxFloor:[],
        Username:[]
    });
    const [data, setData] = useState({
        Gold: 0,
        Floor: 0,
        GamesPlayed: 0,
        Name: ""
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userEmail = user.email;
                const userDoc = await getDoc(doc(firestore, "users", userEmail));
                setUsername(userDoc.data().username);
                setUserType(userDoc.data().userType);
            } else {
                navigate("/");
            }
        });

        return () => {
            unsubscribe();
        };
    }, [navigate]);

    useEffect(() => {
        // Using fetch to fetch the api from
        // flask server it will be redirected to proxy
        fetch("/allRuns").then((res) =>
            res.json().then((data) => {
                setruns({
                    Date: data.Date,
                    Success: data.Success,
                    Duration: data.Duration,
                    Gold: data.Gold,
                    MaxFloor: data.MaxFloor,
                    Username: data.Username

                })

            })
        )}, []);
    useEffect(() => {
        // Using fetch to fetch the api from
        // flask server it will be redirected to proxy
        fetch("/allUserRuns").then((res) =>
            res.json().then((data) => {
                setUserRuns({
                    Date: data.Date,
                    Success: data.Success,
                    Duration: data.Duration,
                    Gold: data.Gold,
                    MaxFloor: data.MaxFloor,
                    Username: data.Username
                })
            })
        )}, []);


    // const dat = { query: "SELECT * FROM [SlayTheSpireStats].[dbo].[RUN]"};
    // axios.post('https://y6tjzscvy4arbpupgs34cul4ju0csosw.lambda-url.us-east-1.on.aws/', dat).then(res => {
    //     console.log(res.data);
    //     setruns(res.data);
    //   });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userEmail = user.email;
                const userDoc = await getDoc(doc(firestore, "users", userEmail));
                setUsername(userDoc.data().username);
                setUserType(userDoc.data().userType);
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

    const renderTableHeader = () => (
        <TableHead>
            <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Success?</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Ending Gold</TableCell>
                <TableCell>MaxFloor</TableCell>
            </TableRow>
        </TableHead>
    );

    const renderTableBody = (runsData) => (
        <TableBody>
            {runsData.Date.map((_, index) => {
                const regex = /^(\w+\s\d{1,2}\s\d{4}\s\s?\d{1,2}:\d{2}[AP]M)\s(b'\\x00'|b'\\x01')\s([\d\.]+)\s(\d+)\s(\d+)\s(\w+)$/;
                const match = runsData.Date[index].match(regex);

                if (match) {
                    const date = match[1];
                    const success = match[2] === "b'\\x01'" ? "Yes" : "No";
                    let duration = Math.round(Number(match[3]));
                    if (duration > 100000) {
                        duration = Math.round(duration / 1000000000);
                    }
                    const minutes = Math.floor(duration / 60);
                    const seconds = duration % 60;
                    const formattedDuration = `${minutes}m ${seconds}s`;
                    const gold = Number(match[4]);
                    const floorReached = Number(match[5]);
                    const username = match[6];

                    return (
                        <TableRow key={index}>
                            <TableCell>{date}</TableCell>
                            <TableCell>{username}</TableCell> {/* Add this cell */}
                            <TableCell>{success}</TableCell>
                            <TableCell>{formattedDuration}</TableCell>
                            <TableCell>{gold}</TableCell>
                            <TableCell>{floorReached}</TableCell>
                        </TableRow>
                    );
                } else {
                    return null;
                }
            })}
        </TableBody>
    );

    const handleLogout = async () => {
        sessionStorage.setItem('isLoggedIn', false);
        await signOut(auth);
        navigate('/');
    };

    const deleteRun = () => {
        fetch("/delete").then((res) =>
            res.json().then((data) => {

            }))
    };

    const showHome = async () =>{
        navigate('/home');
    }

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
                        style={{ width: '600px', flexDirection: 'column', alignItems: 'center' }}
                        sx={{
                            padding: '2rem',
                            borderRadius: '0.5rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.91)',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant="h2" color='Black' sx={{ marginTop: '1rem', marginBottom: '1rem' }}>SlayTheSpireStats</Typography>
                        <TableContainer component={Paper} sx={{ maxHeight: '80vh', overflowY: 'scroll' }}>
                            {userType === "admin" ? (
                                <Table>
                                    {renderTableHeader()}
                                    {renderTableBody(runs)}
                                </Table>
                            ) : (
                                <Table>
                                    {renderTableHeader()}
                                    {renderTableBody(userruns)}
                                </Table>
                            )}
                        </TableContainer>

                        <div className="buttons">
                            <Button variant="contained" onClick={deleteRun} sx={{ marginBottom: '1rem' }}>Delete Most Recent Run</Button>
                            <Button variant="contained" sx={{ marginBottom: '1rem' }} onClick={showHome}>Back Home</Button>
                        </div>
                    </Paper>
                </div>
            </div>
        </>
    );
}

export default Runs;
