const bcrypt = require("bcrypt");
const { db, jwt } = require("../../config");

const SALT_ROUNDS = 10;

/**
 * Register user
 */
async function register({ name, email, password }) {
    // Check existing user
    const [exists] = await db.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
    );
    if (exists.length) {
        throw new Error("Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user
    const [result] = await db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
    );

    return {
        id: result.insertId,
        name,
        email,
    };
}

/**
 * Login user
 */
async function login({ email, password }) {
    const [rows] = await db.query(
        "SELECT id, name, email, password FROM users WHERE email = ?",
        [email]
    );

    if (!rows.length) {
        throw new Error("Invalid credentials");
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    // Generate JWT
    const token = jwt.generateToken({ id: user.id });

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    };
}

module.exports = {
    register,
    login,
};