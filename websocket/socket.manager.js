/**
 * userId -> WebSocket instance
 * One user = one active socket (simple version)
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

module.exports = {
    addUser,
    removeUser,
    getUserSocket,
    getAllOnlineUsers,
};