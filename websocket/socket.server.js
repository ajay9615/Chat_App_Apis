// const WebSocket = require("ws");
// const { jwt, db } = require("../config");
// const socketManager = require("./socket.manager");
// const messageService = require("../modules/messages/message.service");

// const wss = new WebSocket.Server({ noServer: true });

// function handleWSConnection(ws, req) {
//     try {
//         const url = new URL(req.url, "http://localhost");
//         const token = url.searchParams.get("token");

//         if (!token) return ws.close();

//         const decoded = jwt.verifyToken(token);
//         const userId = decoded.id;

//         // 🟢 Online
//         socketManager.addUser(userId, ws);
//         db.query("UPDATE users SET is_online = 1 WHERE id = ?", [userId]);

//         console.log(`🟢 User ${userId} connected via WebSocket`);

//         ws.on("message", async (data) => {
//             try {
//                 if (!data || data.toString().trim() === "") return;

//                 const payload = JSON.parse(data.toString());
//                 console.log("📩 Incoming WS payload:", payload);

//                 // ✅ CORRECT FUNCTION
//                 const savedMessage = await messageService.saveMessage({
//                     conversationId: payload.conversationId,
//                     senderId: payload.senderId,
//                     message: payload.message,
//                 });

//                 // 📤 Send to receivers
//                 payload.receiverIds.forEach((rid) => {
//                     const receiverSocket = socketManager.getUserSocket(rid);
//                     if (receiverSocket) {
//                         console.log(`📤 Sending message to user ${rid}`);
//                         receiverSocket.send(JSON.stringify(savedMessage));
//                     } else {
//                         console.log(`⚠️ User ${rid} not online`);
//                     }
//                 }


//             );

//             // after saving message
// payload.receiverIds.forEach((rid) => {
//   const receiverSocket = socketManager.getUserSocket(rid);

//   if (receiverSocket) {
//     receiverSocket.send(JSON.stringify(savedMessage));

//     // 🔥 MARK DELIVERED
//     db.query(
//       "UPDATE messages SET delivered = 1 WHERE id = ?",
//       [savedMessage.id]
//     );

//     // 🔁 notify sender (real-time)
//     const senderSocket =
//       socketManager.getUserSocket(payload.senderId);

//     if (senderSocket) {
//       senderSocket.send(
//         JSON.stringify({
//           type: "DELIVERED",
//           messageId: savedMessage.id,
//         })
//       );
//     }
//   }
// });
//             } catch (err) {
//                 console.error("WS message error:", err.message);
//             }
//         });

//         ws.on("close", () => {
//             socketManager.removeUser(userId);
//             db.query("UPDATE users SET is_online = 0 WHERE id = ?", [userId]);
//             console.log(`🔴 User ${userId} disconnected`);
//         });
//     } catch (err) {
//         ws.close();
//     }
// }

// module.exports = { wss, handleWSConnection };


const WebSocket = require("ws");
const { jwt, db } = require("../config");
const socketManager = require("./socket.manager");
const messageService = require("../modules/messages/message.service");
const { sendPush } = require("../services/push.service");

const wss = new WebSocket.Server({ noServer: true });

function handleWSConnection(ws, req) {
    try {
        const url = new URL(req.url, "http://localhost");
        const token = url.searchParams.get("token");
        if (!token) return ws.close();

        const decoded = jwt.verifyToken(token);
        const userId = decoded.id;

        // 🟢 ONLINE
        socketManager.addUser(userId, ws);
        db.query("UPDATE users SET is_online = 1 WHERE id = ?", [userId]);

        console.log(`🟢 User ${userId} connected`);

        ws.on("message", async (data) => {
            try {
                if (!data || !data.toString().trim()) return;

                const payload = JSON.parse(data.toString());
                console.log("📩 WS payload:", payload);

                // 🔵 TYPING EVENT
                if (payload.type === "TYPING") {
                    payload.receiverIds.forEach((rid) => {
                        const socket = socketManager.getUserSocket(rid);
                        if (socket) socket.send(JSON.stringify(payload));
                    });
                    return;
                }

                // 💬 SAVE MESSAGE
                const savedMessage = await messageService.saveMessage({
                    conversationId: payload.conversationId,
                    senderId: payload.senderId,
                    message: payload.message,
                });

                // 📤 SEND TO USERS OR PUSH
                for (const rid of payload.receiverIds) {
                    const receiverSocket = socketManager.getUserSocket(rid);

                    if (receiverSocket) {
                        // 🟢 ONLINE → WS
                        receiverSocket.send(JSON.stringify(savedMessage));

                        await db.query(
                            "UPDATE messages SET delivered = 1 WHERE id = ?",
                            [savedMessage.id]
                        );

                        // notify sender ✓✓
                        const senderSocket =
                            socketManager.getUserSocket(payload.senderId);

                        if (senderSocket) {
                            senderSocket.send(
                                JSON.stringify({
                                    type: "DELIVERED",
                                    messageId: savedMessage.id,
                                })
                            );
                        }
                    } else {
                        // 🔔 OFFLINE → PUSH
                        const [[user]] = await db.query(
                            "SELECT device_token FROM users WHERE id = ?",
                            [rid]
                        );

                        if (user?.device_token) {
                            await sendPush({
                                token: user.device_token,
                                title: "New Message",
                                body: payload.message,
                                data: {
                                    conversationId: payload.conversationId,
                                    senderId: payload.senderId,
                                },
                            });
                        }
                    }
                }
            } catch (err) {
                console.error("WS error:", err.message);
            }
        });

        ws.on("close", async () => {
            socketManager.removeUser(userId);

            await db.query(
                "UPDATE users SET is_online = 0, last_seen = NOW() WHERE id = ?",
                [userId]
            );

            socketManager.broadcast({
                type: "STATUS",
                userId,
                isOnline: false,
                lastSeen: new Date(),
            });

            console.log(`🔴 User ${userId} disconnected`);
        });
    } catch (err) {
        ws.close();
    }
}

module.exports = { wss, handleWSConnection };