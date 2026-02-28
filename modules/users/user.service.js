const { db } = require("../../config");

/**
 * Get logged-in user profile
 */
async function getProfile(userId) {
    const [rows] = await db.query(
        "SELECT id, name, email, profile_image, is_online, last_seen FROM users WHERE id = ?",
        [userId]
    );

    if (!rows.length) {
        throw new Error("User not found");
    }

    return rows[0];
}

/**
 * Get all users except me (for chat list)
 */
async function getAllUsers(myUserId) {
    const [rows] = await db.query(
        `SELECT id, name, email, is_online, last_seen
     FROM users
     WHERE id != ?
     ORDER BY is_online DESC, name ASC`,
        [myUserId]
    );

    return rows;
}

/**
 * Update profile (name / image)
 */
async function updateProfile(userId, { name, profile_image }) {
    await db.query(
        "UPDATE users SET name = ?, profile_image = ? WHERE id = ?",
        [name, profile_image, userId]
    );

    return { message: "Profile updated successfully" };
}

module.exports = {
    getProfile,
    getAllUsers,
    updateProfile,
};