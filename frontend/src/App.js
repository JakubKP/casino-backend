import React from 'react';
import './App.css';
import io from 'socket.io-client'
const socket = io.connect(`http://localhost:${process.env.PORT || 8000}`)

function App() {
  return (
    <div className="App">
      Hi
    </div>
  );
}

export default App;