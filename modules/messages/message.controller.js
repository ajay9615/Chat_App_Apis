const messageService = require("./message.service");

/**
 * GET /messages/:conversationId
 */
async function list(req, res) {
    try {
        const { conversationId } = req.params;
        const messages = await messageService.getMessages(conversationId);
        return res.json(messages);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

/**
 * POST /messages/seen
 */
async function seen(req, res) {
    try {
        const userId = req.user.id;
        const { conversationId } = req.body;

        await messageService.markSeen(conversationId, userId);
        return res.json({ status: "seen updated" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

module.exports = {
    list,
    seen,
};