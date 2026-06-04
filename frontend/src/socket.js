import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
    autoConnect: false // disabilita la connesione automatia
});

export default socket;