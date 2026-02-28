require("dotenv").config();
const http = require("http");
const app = require("./app");
const { wss, handleWSConnection } = require("./websocket/socket.server");

const server = http.createServer(app);

// WebSocket upgrade handling
server.on("upgrade", (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, (ws) => {
        handleWSConnection(ws, req);
    });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`🚀 REST + WebSocket server running on port ${PORT}`);
});