/**
 * userId -> WebSocket
 */
const onlineUsers = new Map();

function addUser(userId, socket) {
    onlineUsers.set(userId, socket);
}

function removeUser(userId) {
    onlineUsers.delete(userId);
}

function getUserSocket(userId) {
    return onlineUsers.get(userId);
}

function getAllOnlineUsers() {
    return [...onlineUsers.keys()];
}

function broadcast(payload) {
    onlineUsers.forEach((ws) => {
        ws.send(JSON.stringify(payload));
    });
}

module.exports = {
    addUser,
    removeUser,
    getUserSocket,
    getAllOnlineUsers,
    broadcast,
};