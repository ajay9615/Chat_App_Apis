const userService = require("./user.service");

/**
 * GET /users/profile
 */
async function profile(req, res) {
    try {
        const userId = req.user.id;
        const user = await userService.getProfile(userId);
        return res.json(user);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
}

/**
 * GET /users
 */
async function listUsers(req, res) {
    try {
        const myUserId = req.user.id;
        const users = await userService.getAllUsers(myUserId);
        return res.json(users);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

/**
 * PUT /users/profile
 */
async function update(req, res) {
    try {
        const userId = req.user.id;
        const { name, profile_image } = req.body;

        const result = await userService.updateProfile(userId, {
            name,
            profile_image,
        });

        return res.json(result);
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

module.exports = {
    profile,
    listUsers,
    update,
};