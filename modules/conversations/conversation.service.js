const { db } = require("../../config");

/**
 * Find or create ONE-TO-ONE conversation
 */
async function getOrCreateOneToOne(userA, userB) {
    // Check existing conversation
    const [rows] = await db.query(
        `
    SELECT c.id
    FROM conversations c
    JOIN conversation_members m1 ON m1.conversation_id = c.id
    JOIN conversation_members m2 ON m2.conversation_id = c.id
    WHERE c.type = 'one_to_one'
      AND m1.user_id = ?
      AND m2.user_id = ?
    `,
        [userA, userB]
    );

    if (rows.length) {
        return rows[0];
    }

    // Create new conversation
    const [conv] = await db.query(
        "INSERT INTO conversations (type, created_by) VALUES ('one_to_one', ?)",
        [userA]
    );

    const conversationId = conv.insertId;

    // Add members
    await db.query(
        "INSERT INTO conversation_members (conversation_id, user_id) VALUES (?, ?), (?, ?)",
        [conversationId, userA, conversationId, userB]
    );

    return { id: conversationId };
}

/**
 * Create GROUP conversation
 */
async function createGroup({ title, createdBy, memberIds }) {
    const [conv] = await db.query(
        "INSERT INTO conversations (type, title, created_by) VALUES ('group', ?, ?)",
        [title, createdBy]
    );

    const conversationId = conv.insertId;

    // Add creator as admin
    await db.query(
        "INSERT INTO conversation_members (conversation_id, user_id, role) VALUES (?, ?, 'admin')",
        [conversationId, createdBy]
    );

    // Add members
    for (const userId of memberIds) {
        await db.query(
            "INSERT INTO conversation_members (conversation_id, user_id) VALUES (?, ?)",
            [conversationId, userId]
        );
    }

    return { id: conversationId };
}

/**
 * Get conversations of logged-in user
 */
async function getUserConversations(userId) {
    const [rows] = await db.query(
        `
    SELECT c.id, c.type, c.title, c.created_at
    FROM conversations c
    JOIN conversation_members cm ON cm.conversation_id = c.id
    WHERE cm.user_id = ?
    ORDER BY c.created_at DESC
    `,
        [userId]
    );

    return rows;
}

module.exports = {
    getOrCreateOneToOne,
    createGroup,
    getUserConversations,
};