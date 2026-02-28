const WebSocket = require("ws");
const { jwt, db } = require("../config");
const socketManager = require("./socket.manager");
const messageService = require("../modules/messages/message.service");

const wss = new WebSocket.Server({ noServer: true });

function handleWSConnection(ws, req) {
    try {
        const url = new URL(req.url, "http://localhost");
        const token = url.searchParams.get("token");

        if (!token) return ws.close();

        const decoded = jwt.verifyToken(token);
        const userId = decoded.id;

        // 🟢 Online
        socketManager.addUser(userId, ws);
        db.query("UPDATE users SET is_online = 1 WHERE id = ?", [userId]);

        console.log(`🟢 User ${userId} connected via WebSocket`);

        ws.on("message", async (data) => {
            try {
                if (!data || data.toString().trim() === "") return;

                const payload = JSON.parse(data.toString());
                console.log("📩 Incoming WS payload:", payload);

                // ✅ CORRECT FUNCTION
                const savedMessage = await messageService.saveMessage({
                    conversationId: payload.conversationId,
                    senderId: payload.senderId,
                    message: payload.message,
                });

                // 📤 Send to receivers
                payload.receiverIds.forEach((rid) => {
                    const receiverSocket = socketManager.getUserSocket(rid);
                    if (receiverSocket) {
                        console.log(`📤 Sending message to user ${rid}`);
                        receiverSocket.send(JSON.stringify(savedMessage));
                    } else {
                        console.log(`⚠️ User ${rid} not online`);
                    }
                });
            } catch (err) {
                console.error("WS message error:", err.message);
            }
        });

        ws.on("close", () => {
            socketManager.removeUser(userId);
            db.query("UPDATE users SET is_online = 0 WHERE id = ?", [userId]);
            console.log(`🔴 User ${userId} disconnected`);
        });
    } catch (err) {
        ws.close();
    }
}

module.exports = { wss, handleWSConnection };

// const WebSocket = require("ws");
// const { jwt, db } = require("../config");
// const socketManager = require("./socket.manager");
// const messageService = require("../modules/messages/message.service");

// const wss = new WebSocket.Server({ noServer: true });

// function handleWSConnection(ws, req) {
//     try {
//         // 🔐 JWT from query
//         const url = new URL(req.url, "http://localhost");
//         const token = url.searchParams.get("token");

//         if (!token) {
//             ws.close();
//             return;
//         }

//         const decoded = jwt.verifyToken(token);
//         const userId = decoded.id;

//         // 🟢 Mark online
//         socketManager.addUser(userId, ws);
//         db.query("UPDATE users SET is_online = 1 WHERE id = ?", [userId]);

//         console.log(`🟢 User ${userId} connected via WebSocket`);

//         // 📩 Receive message
//         ws.on("message", async (data) => {
//             try {
//                 const payload = JSON.parse(data.toString());

//                 /**
//                  * payload example:
//                  * {
//                  *   conversationId,
//                  *   senderId,
//                  *   receiverIds: [2,3],
//                  *   message
//                  * }
//                  */

//                 // Save message (DB + receipts)
//                 const savedMessage =
//                     await messageService.saveAndDispatch(payload);

//                 // Send to receivers
//                 payload.receiverIds.forEach((rid) => {
//                     const receiverSocket = socketManager.getUserSocket(rid);
//                     if (receiverSocket) {
//                         receiverSocket.send(JSON.stringify(savedMessage));
//                     }
//                 });
//             } catch (err) {
//                 console.error("WS message error:", err.message);
//             }
//         });

//         // ❌ Disconnect
//         ws.on("close", () => {
//             socketManager.removeUser(userId);
//             db.query("UPDATE users SET is_online = 0 WHERE id = ?", [userId]);
//             console.log(`🔴 User ${userId} disconnected`);
//         });
//     } catch (err) {
//         ws.close();
//     }
// }

// module.exports = {
//     wss,
//     handleWSConnection,
// };