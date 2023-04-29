import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Button, Typography, Paper } from '@mui/material';
import { auth } from './backend/FirebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc, getFirestore } from 'firebase/firestore';
import LogoutIcon from '@mui/icons-material/Logout';
import { Navigate, useNavigate } from 'react-router-dom';
import './Home.css';
import axios from "axios";

function Home() {
    const firestore = getFirestore();
    const navigate = useNavigate();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [username, setUsername] = useState("");
    const [userType, setUserType] = useState("");
    const [runs, setruns] = useState([]);
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


    // const dat = { query: "SELECT * FROM [SlayTheSpireStats].[dbo].[RUN]"};
    // axios.post('https://y6tjzscvy4arbpupgs34cul4ju0csosw.lambda-url.us-east-1.on.aws/', dat).then(res => {
    //     console.log(res.data);
    //     setruns(res.data);
    //   });


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
                Gold: data.Gold,
                Floor: data.Floor,
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
            Gold: data.Gold,
            Floor: data.Floor,
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

    // useEffect(() => {
    //     // Using fetch to fetch the api from 
    //     // flask server it will be redirected to proxy
    //     fetch("/userRelics").then((res) =>
    //         res.json().then((data) => {
    //             setUserRelics({
    //                 Relics: data.Relics
    //             })
    //             // Setting a data from api
    //         })
    //     ).then((res) => 
    //     fetch("/user").then((res) => 
    //     res.json().then((data) => {
    //         setUserCards({
    //             Cards: data.Cards
    //         })
    //         // Setting a data from api
    //     }))).then((res) => 
    //     fetch("/userAll").then((res) =>
    //     res.json().then((data) => {
    //         setUserData({
    //             Gold: data.Gold,
    //             Floor: data.Floor,
    //             GamesPlayed: data.GamesPlayed,
    //             Name: data.Name
    //         })
    //     })
    // )).then((res) => 
    // fetch("/userWinRate").then((res) =>
    // res.json().then((data) => {
    //     setUserRate({
    //         Rate: data.Rate
    //     })
    // }))).then((res) => 
    // fetch("/userCardNum").then((res) =>
    // res.json().then((data) => {
    //     setUserCardRate({
    //         Card: data.Card
    //     })
       
    // })));

    // }, []);

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

    const showRuns = async () =>{ 
        navigate('/runs');
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
                            <div>
                            {userType === "admin" ? (
                                <div>
                                    <Typography>Games Played: {data.GamesPlayed}</Typography>
                                    <Typography>Average Gold Achieved: {data.Gold}</Typography>
                                    <Typography>Average Floor Reached: {data.Floor}</Typography>
                                    <Typography>Total user win percentage: {rate.Rate}</Typography>
                                    <Typography>Average cards from a winning run: {cardRate.Card}</Typography>
                                    <Typography>Most commonly Purchased Cards: </Typography>
                                    <table className="Live-games">
                                            {/*https://www.telerik.com/blogs/beginners-guide-loops-in-react-jsx */}
                                            {cards.Cards.map(cards => (
                                            <tr>
                                            <th>{cards}</th>
                                        </tr>
                                        ))}
                                    </table>
                                    <Typography>Most commonly Purchased Relics: </Typography>
                                    <table className="Live-games">
                                            {/*https://www.telerik.com/blogs/beginners-guide-loops-in-react-jsx */}
                                            {relics.Relics.map(relics => (
                                            <tr>
                                            <th>{relics}</th>
                                        </tr>
                                        ))}
                                    </table>
                                </div>
                            ) : (<div>
                                <Typography>Games Payed: {userdata.GamesPlayed}</Typography>
                                <Typography>Average Gold Achieved: {userdata.Gold}</Typography>
                                <Typography>Average Floor Reached: {userdata.Floor}</Typography>
                                <Typography>Total user win percentage: {userrate.Rate}</Typography>
                                <Typography>Average cards from a winning run: {usercardRate.Card}</Typography>
                                <Typography>Most commonly Purchased Cards: </Typography>
                                <table className="Live-games">
                                        {/*https://www.telerik.com/blogs/beginners-guide-loops-in-react-jsx */}
                                        {usercards.Cards.map(cards => (
                                        <tr>
                                        <th>{cards}</th>
                                    </tr>
                                    ))}
                                </table>
                                <Typography>Most commonly Purchased Relics: </Typography>
                                <table className="Live-games">
                                        {/*https://www.telerik.com/blogs/beginners-guide-loops-in-react-jsx */}
                                        {userrelics.Relics.map(relics => (
                                        <tr>
                                        <th>{relics}</th>
                                    </tr>
                                    ))}
                                </table>
                            </div>)}
                        </div>

                        <div className="buttons">
                            <Button variant="contained" sx={{marginBottom: '1rem'}} onClick={showRuns}>View All Runs</Button>
                        </div>
                    </Paper>
                </div>
            </div>
        </>
    );
}

export default Home;
