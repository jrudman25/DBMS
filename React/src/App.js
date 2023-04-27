import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login'
import Signup from './Signup'
import './App.css';

function App() {

    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<Home />} />
                <Route path="*" element={isLoggedIn ? <Navigate to="/home" /> : <Navigate to="/" />} />
                <Route
                    path="*"
                    element={isLoggedIn ? <Home /> : <Login />}
                />
            </Routes>
        </Router>
    );
}

export default App;
