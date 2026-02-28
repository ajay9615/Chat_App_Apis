const conversationService = require("./conversation.service");

/**
 * POST /conversations/one-to-one
 */
async function oneToOne(req, res) {
    try {
        const userA = req.user.id;
        const { userB } = req.body;

        const conversation =
            await conversationService.getOrCreateOneToOne(userA, userB);

        res.json(conversation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

/**
 * POST /conversations/group
 */
async function createGroup(req, res) {
    try {
        const createdBy = req.user.id;
        const { title, memberIds } = req.body;

        const conversation = await conversationService.createGroup({
            title,
            createdBy,
            memberIds,
        });

        res.status(201).json(conversation);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

/**
 * GET /conversations
 */
async function myConversations(req, res) {
    try {
        const userId = req.user.id;
        const conversations =
            await conversationService.getUserConversations(userId);

        res.json(conversations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = {
    oneToOne,
    createGroup,
    myConversations,
};