import React, { useState } from 'react';
import './App.css';

function App() {
    const [status, setStatus] = useState('Not Connected');

    const checkConnection = () => {
        fetch('/api/check-connection')
            .then(res => res.text())
            .then(data => setStatus(data))
            .catch(err => console.error('Error checking connection:', err));
    };

    const closeConnection = () => {
        setStatus('Not Connected');
    };

    return (
        <div>
            <h1>Connection Status: {status}</h1>
            <button onClick={checkConnection}>Open Connection</button>
            <button onClick={closeConnection}>Close Connection</button>
        </div>
    );
}

export default App;
