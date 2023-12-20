import io from 'socket.io-client';
export const socket = io(`${process.env.ADMIN_ENDPOINT_BACKEND}`);
export default socket;