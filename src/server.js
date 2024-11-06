const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const socketServer = socketIo(server);

// Set the view engine to EJS
app.set("view engine", "ejs");

// Specify the path to the views folder inside src
app.set("views", "./src/views");

// Serve static files from the public directory
app.use(express.static("public"));

// Serve the main chat page
app.get("/", (req, res) => {
    res.render("index");
});

// Handle WebSocket connections
socketServer.on("connection", (socketClient) => {
    console.log("A user connected", socketClient.id);

    // Handle incoming chat messages
    socketClient.on("chat-message", ({ msg, userId, senderName }) => {
        // Broadcast the message with the username and user ID
        socketServer.emit("chat-message", { msg, userId, senderName });
    });

    // Handle user disconnect
    socketClient.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
