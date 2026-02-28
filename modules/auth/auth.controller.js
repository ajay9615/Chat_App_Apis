const authService = require("./auth.service");

/**
 * POST /auth/register
 */
async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await authService.register({ name, email, password });
        return res.status(201).json({
            message: "User registered successfully",
            user,
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

/**
 * POST /auth/login
 */
async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const data = await authService.login({ email, password });
        return res.status(200).json(data);
    } catch (err) {
        return res.status(401).json({ message: err.message });
    }
}

module.exports = {
    register,
    login,
};