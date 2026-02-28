const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
// Routes
const authRoutes = require("./modules/auth/auth.routes");
const userRoutes = require("./modules/users/user.routes");
const conversationRoutes = require("./modules/conversations/conversation.routes");
const messageRoutes = require("./modules/messages/message.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 🔥 Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Routes registration
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/conversations", conversationRoutes);
app.use("/messages", messageRoutes);

// Health check
app.get("/", (req, res) => {
    res.send("Chat API is running");
});

module.exports = app;