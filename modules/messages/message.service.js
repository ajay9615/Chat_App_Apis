const { db } = require("../../config");

/**
 * Save message (used by WebSocket)
 */
async function saveMessage({
    conversationId,
    senderId,
    message,
}) {
    const [result] = await db.query(
        "INSERT INTO messages (conversation_id, sender_id, message, delivered) VALUES (?, ?, ?, 1)",
        [conversationId, senderId, message]
    );

    return {
        id: result.insertId,
        conversationId,
        senderId,
        message,
        delivered: 1,
        seen: 0,
        createdAt: new Date(),
    };
}

/**
 * Get chat history (REST)
 */
async function getMessages(conversationId) {
    const [rows] = await db.query(
        `SELECT m.id, m.message, m.sender_id, m.delivered, m.seen, m.created_at,
            u.name AS sender_name
     FROM messages m
     JOIN users u ON u.id = m.sender_id
     WHERE m.conversation_id = ?
     ORDER BY m.created_at ASC`,
        [conversationId]
    );

    return rows;
}

/**
 * Mark messages as SEEN
 */
async function markSeen(conversationId, userId) {
    await db.query(
        `UPDATE messages
     SET seen = 1
     WHERE conversation_id = ?
     AND sender_id != ?`,
        [conversationId, userId]
    );

    return { message: "Messages marked as seen" };
}

module.exports = {
    saveMessage,
    getMessages,
    markSeen,
};