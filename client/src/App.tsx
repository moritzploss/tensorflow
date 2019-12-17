import React from 'react';
import uuid from 'uuid/v4';

import './App.css';

const openWebSocket = (socketId: string): WebSocket => {
  const protocolPrefix = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const { host } = window.location;
  return new WebSocket(`${protocolPrefix}//${host}/sockets/clients/${socketId}`);
}

const App: React.FC = () => {

  const socket = openWebSocket(uuid());

  return (
    <div className="App">
      {socket.readyState}
    </div>
  );
}

export default App;
