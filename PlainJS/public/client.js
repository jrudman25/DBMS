function testConnection() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/batadase/public/test-connection');
    xhr.onload = function() {
        if (xhr.status === 200) {
            setStatus('Connected');
        } else {
            setStatus('Connection failed');
        }
    };
    xhr.send();
}

function closeConnection() {
    setStatus('Not connected');
}

function setStatus(status) {
    document.getElementById('status').textContent = status;
}
