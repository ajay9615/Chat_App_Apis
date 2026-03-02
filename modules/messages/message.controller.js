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
        const { conversationId, messageIds } = req.body;

        await messageService.markSeen(conversationId, userId);

        // 🔁 notify sender
        messageIds.forEach((id) => {
            const senderSocket =
                socketManager.getUserSocket(userId);

            if (senderSocket) {
                senderSocket.send(
                    JSON.stringify({
                        type: "SEEN",
                        messageId: id,
                    })
                );
            }
        });

        res.json({ status: "seen updated" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

async function saveDeviceToken(req, res) {
    try {
        const userId = req.user.id;
        const { deviceToken } = req.body;

        await db.query(
            "UPDATE users SET device_token = ? WHERE id = ?",
            [deviceToken, userId]
        );

        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = {
    list,
    seen,
    saveDeviceToken
};