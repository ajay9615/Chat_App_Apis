const { jwt } = require("../config");

/**
 * Protect REST APIs with JWT
 * Header: Authorization: Bearer <token>
 */
function authMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization token missing" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verifyToken(token);

        // attach user info to request
        req.user = {
            id: decoded.id,
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = authMiddleware;