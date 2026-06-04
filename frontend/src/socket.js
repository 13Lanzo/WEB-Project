import io from 'socket.io-client';

const socket = io('http://10.31.99.48:5000', {
    autoConnect: false
});

export default socket;
