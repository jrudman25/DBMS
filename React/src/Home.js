import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Button, Typography, Paper, Grid } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Box, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { auth } from './backend/FirebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc, updateDoc, getDocs, collection, getFirestore } from 'firebase/firestore';
import LogoutIcon from '@mui/icons-material/Logout';
import { Navigate, useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
    const firestore = getFirestore();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [userType, setUserType] = useState("");
    const [allUsers, setAllUsers] = useState([]);
    const [openManageUsersDialog, setOpenManageUsersDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        Gold: 0,
        Floor: 0,
        GamesPlayed: 0,
        Name: ""
    });
    const [cards, setCards] = useState({
        Cards:[]
    });
    const [relics, setRelics] = useState({
        Relics:[]
    });
    const [rate, setRate] = useState({
        Rate:0
    });
    const [cardRate, setCardRate] = useState({
        Card:0
    })

    const [userdata, setUserData] = useState({
        Gold: 0,
        Floor: 0,
        GamesPlayed: 0,
        Name: ""
    });
    const [usercards, setUserCards] = useState({
        Cards:[]
    });
    const [userrelics, setUserRelics] = useState({
        Relics:[]
    });
    const [userrate, setUserRate] = useState({
        Rate:0
    });
    const [usercardRate, setUserCardRate] = useState({
        Card:0
    })


    useEffect(() => {
        // Using fetch to fetch the api from
        // flask server it will be redirected to proxy
        fetch("/relics").then((res) =>
            res.json().then((data) => {
                setRelics({
                    Relics: data.Relics
                })
                // Setting a data from api
            })
        ).then((res) =>
            fetch("/admin").then((res) =>
                res.json().then((data) => {
                    setCards({
                        Cards: data.Cards
                    })
                    // Setting a data from api
                }))).then((res) =>
            fetch("/all").then((res) =>
                res.json().then((data) => {
                    setData({
                        Gold: Math.round(data.Gold),
                        Floor: Math.round(data.Floor),
                        GamesPlayed: data.GamesPlayed,
                        Name: data.Name
                    })
                    // Setting a data from api
                })
            )).then((res) =>
            fetch("/winRate").then((res) =>
                res.json().then((data) => {
                    setRate({
                        Rate: data.Rate
                    })

                }))).then((res) =>
            fetch("/cardNum").then((res) =>
                res.json().then((data) => {
                    setCardRate({
                        Card: data.Card
                    })

                }))).then((res) =>  fetch("/userRelics").then((res) =>
            res.json().then((data) => {
                setUserRelics({
                    Relics: data.Relics
                })
                // Setting a data from api
            })
        ).then((res) =>
            fetch("/user").then((res) =>
                res.json().then((data) => {
                    setUserCards({
                        Cards: data.Cards
                    })
                    // Setting a data from api
                }))).then((res) =>
            fetch("/userAll").then((res) =>
                res.json().then((data) => {
                    setUserData({
                        Gold: Math.round(data.Gold),
                        Floor: Math.round(data.Floor),
                        GamesPlayed: data.GamesPlayed,
                        Name: data.Name
                    })
                })
            )).then((res) =>
            fetch("/userWinRate").then((res) =>
                res.json().then((data) => {
                    setUserRate({
                        Rate: data.Rate
                    })
                }))).then((res) =>
            fetch("/userCardNum").then((res) =>
                res.json().then((data) => {
                    setUserCardRate({
                        Card: data.Card
                    })

                }))));

    }, []);

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
        if (userType === "admin") {
            fetchAllUsers();
        }
    }, [userType]);

    if (!(sessionStorage.getItem('isLoggedIn') === 'true')) {
        return <Navigate to="/" />;
    }

    const handleOpenManageUsersDialog = () => {
        setOpenManageUsersDialog(true);
    };

    const handleCloseManageUsersDialog = () => {
        setOpenManageUsersDialog(false);
    };

    const showRuns = async () =>{
        navigate('/runs');
    };

    const fetchAllUsers = async () => {
        const usersCollection = collection(firestore, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setAllUsers(usersList);
    };

    const setAdmin = async (userId) => {
        const userRef = doc(firestore, "users", userId);
        await updateDoc(userRef, { userType: "admin" });
        const updatedUsers = allUsers.map((user) => (user.id === userId ? { ...user, userType: "admin" } : user));
        setAllUsers(updatedUsers);
    };

    const handleLogout = async () => {
        sessionStorage.setItem('isLoggedIn', false);
        await signOut(auth);
        navigate('/');
    };

    const StatItem = ({ label, value }) => (
        <Grid item xs={12} sm={6}>
            <Typography variant="body1">
                <strong>{label}:</strong> {value}
            </Typography>
        </Grid>
    );

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
                        style={{display: 'flex', width: '600px', flexDirection: 'column', alignItems: 'center',}}
                        sx={{
                            padding: '2rem',
                            borderRadius: '0.5rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.91)',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant="h2" color='Black' sx={{ marginTop: '1rem', marginBottom: '1rem' }}>SlayTheSpireStats</Typography>
                        <Typography variant="h4" sx={{ marginTop: '1rem', marginBottom: '1rem' }}>{username}'s stats:</Typography>
                        <Typography variant="h6" color='Black' sx={{ marginBottom: '1rem' }}>{userType === "admin" ? "Admin" : "Not admin"}</Typography>
                        {userType === "admin" ? (
                            <Grid container spacing={2} justifyContent="center">
                                <Paper elevation={1} sx={{padding: '2rem', borderRadius: '0.5rem'}} >
                                    <StatItem label="Games played" value={data.GamesPlayed} />
                                    <StatItem label="Average gold achieved" value={data.Gold} />
                                    <StatItem label="Average floor reached" value={data.Floor} />
                                    <StatItem label="Total user win percentage" value={Math.round(rate.Rate*100)+'%'} />
                                    <Grid item xs={12} display="flex" justifyContent="center" sx={{ paddingBottom: '1rem' }} >
                                        <StatItem label="Average cards from a winning run" value={cardRate.Card} />
                                    </Grid>
                                </Paper>
                                <Grid item xs={12}>
                                    <Typography variant="body1"><strong>Most commonly purchased cards:</strong></Typography>
                                    <ul>
                                        {cards.Cards.map((card) => (
                                            <li>{card}</li>
                                        ))}
                                    </ul>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1"><strong>Most commonly purchased relics:</strong></Typography>
                                    <ul>
                                        {relics.Relics.map((relic) => (
                                            <li>{relic}</li>
                                        ))}
                                    </ul>
                                </Grid>
                            </Grid>
                        ) : (
                            <Grid container spacing={2} justifyContent="center">
                                <StatItem label="Games played" value={userdata.GamesPlayed} />
                                <StatItem label="Average gold achieved" value={userdata.Gold} />
                                <StatItem label="Average floor reached" value={userdata.Floor} />
                                <StatItem label="Total user win percentage" value={Math.round(userrate.Rate*100)+'%'} />
                                <Grid item xs={12} display="flex" justifyContent="center" sx={{ paddingBottom: '1rem' }} >
                                    <StatItem label="Average cards from a winning run" value={cardRate.Card} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1"><strong>Most commonly purchased cards:</strong></Typography>
                                    <ul>
                                        {usercards.Cards.map((card) => (
                                            <li>{card}</li>
                                        ))}
                                    </ul>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1"><strong>Most commonly purchased relics:</strong></Typography>
                                    <ul>
                                        {userrelics.Relics.map((relic) => (
                                            <li>{relic}</li>
                                        ))}
                                    </ul>
                                </Grid>
                            </Grid>
                        )}
                        <div className="buttons">
                            <Button variant="contained" sx={{marginBottom: '1rem'}} onClick={showRuns}>Previous Runs</Button>
                        </div>
                        {userType === "admin" && (
                            <>
                                <Button variant="contained" onClick={handleOpenManageUsersDialog} sx={{ marginTop: "1rem" }}>
                                    Manage Users
                                </Button>
                                <Dialog open={openManageUsersDialog} onClose={handleCloseManageUsersDialog} fullWidth maxWidth="sm">
                                    <DialogTitle>
                                        <Box display="flex" justifyContent="center" alignItems="center">
                                            Manage Users
                                        </Box>
                                    </DialogTitle>
                                    <DialogContent>
                                        <List>
                                            {allUsers.map((user) => (
                                                <ListItem key={user.id}>
                                                    <ListItemText sx={{ paddingBottom: '1rem' }} primary={`${user.username} - ${user.userType === "admin" ? "Admin" : "Not admin"}`} />
                                                    {user.userType !== "admin" && (
                                                        <Button variant="contained" onClick={() => setAdmin(user.id)} size="small">
                                                            Set as Admin
                                                        </Button>
                                                    )}
                                                </ListItem>
                                            ))}
                                        </List>
                                    </DialogContent>
                                    <DialogActions>
                                        <Box display="flex" justifyContent="center" alignItems="center" width="100%">
                                            <Button onClick={handleCloseManageUsersDialog}>Close</Button>
                                        </Box>
                                    </DialogActions>
                                </Dialog>
                            </>
                        )}
                    </Paper>
                </div>
            </div>
        </>
    );
}

export default Home;
