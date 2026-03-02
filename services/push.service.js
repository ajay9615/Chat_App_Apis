const axios = require("axios");

async function sendPush({ token, title, body, data = {} }) {
    try {
        await axios.post(
            "https://fcm.googleapis.com/fcm/send",
            {
                to: token,
                notification: {
                    title,
                    body,
                },
                data,
            },
            {
                headers: {
                    Authorization: `key=${process.env.FCM_SERVER_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("🔔 Push sent");
    } catch (err) {
        console.error("❌ Push failed:", err.message);
    }
}

module.exports = { sendPush };