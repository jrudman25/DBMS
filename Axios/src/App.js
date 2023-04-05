import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [status, setStatus] = useState('Not Connected');

  const handleOpenConnection = async () => {
    const response = await axios.get('/open');
    setStatus(response.data.status);
  };

  const handleCloseConnection = async () => {
    const response = await axios.get('/close');
    setStatus(response.data.status);
  };

  return (
      <div>
        <p>{status}</p>
        <button onClick={handleOpenConnection}>Open Connection</button>
        <button onClick={handleCloseConnection}>Close Connection</button>
      </div>
  );
}

export default App;