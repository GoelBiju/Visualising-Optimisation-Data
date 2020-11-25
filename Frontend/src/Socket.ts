import io from 'socket.io-client';

let socket: SocketIOClient.Socket;

interface Data {
    x: number;
    y: number;
}

export const initiateSocket = () => {
    socket = io('http://localhost:9000/frontend');
    console.log('connected to frontend');
    if (socket) {
        socket.emit('frontend', 'test');
        console.log('emited frontend test message');
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        console.log('disconnected frontend socket');
    }
};

export const subscribeToData = (callback: (data: Data) => void): void => {
    if (!socket) return;

    socket.on('data', (data: Data) => {
        console.log('data: ', data);
        return callback(data);
    });
};
