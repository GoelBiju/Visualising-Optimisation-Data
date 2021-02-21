let socket: SocketIOClient.Socket;

// Configure backend url
const backendUrl = process.env.BACKEND_URL || 'http://localhost:9000/frontend';
console.log('NODE_ENV:', process.env.NODE_ENV);

export interface ScatterData {
    x: number;
    y: number;
}

export const initiateSocket = () => {
    socket = io(backendUrl);
    console.log('connected to backend');
    if (socket) {
        socket.emit('frontend', 'test');
        console.log('emited frontend test message');
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        console.log('disconnected backend socket connection');
    }
};

export const subscribeToData = (callback: (data: ScatterData) => void): void => {
    if (!socket) return;

    socket.on('data', (data: ScatterData) => {
        console.log('data: ', data);
        return callback(data);
    });
};
