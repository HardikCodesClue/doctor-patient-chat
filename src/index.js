import express from 'express';
const app = express();
import { envConfig } from '../config/env.js'; // Import environment configuration
import dbConnection from '../database/db.connection.js'; // Import database connection function
import bodyParser from 'body-parser'; // Middleware for parsing request bodies
import path from 'path'; // Utility for working with file and directory paths
import { fileURLToPath } from 'url'; // Function to convert file URL to path
import { dirname } from 'path'; // Function to get directory name from path

import authRouter from '../routes/auth.routes.js'; // Import authentication routes
import dashboardRouter from '../routes/dashboard.routes.js'; // Import dashboard routes
import { requireLogin } from '../middlewares/authguard.js'; // Middleware to ensure user is logged in
import session from 'express-session'; // Middleware for managing sessions
import http from 'http'; // HTTP server module
import { Server as socketIo } from 'socket.io'; // Import Server class from Socket.io for WebSocket communication
import Message from '../models/chat.model.js'; // Import message model for MongoDB

const server = http.createServer(app); // Create HTTP server with Express app
const io = new socketIo(server); // Initialize Socket.io with the HTTP server instance

const __filename = fileURLToPath(import.meta.url); // Get current file path
const __dirname = dirname(__filename); // Get current directory path

const port = envConfig.NODE_PORT; // Get port number from environment configuration

// Body parser middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure views and template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure session middleware
app.use(session({
  secret: envConfig.AUTH_SECRET, // Secret used to sign session ID cookie
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 1 day (cookie expiration time)
  }
}));

// Route handling
app.use('/auth', authRouter); // Use authentication routes
app.use('/', requireLogin, dashboardRouter); // Use dashboard routes with login requirement

// Connect to MongoDB
dbConnection();

// Socket.io connection handling
io.on('connection', (socket) => {
  // Join a room based on user ID and recipient ID
  socket.on('join', async ({ userId, recipientId }) => {
    const room = `${userId}-${recipientId}`;
    socket.join(room);

    // Fetch old messages from MongoDB
    try {
      const messages = await Message.find({
        $or: [
          { sender: userId, receiver: recipientId },
          { sender: recipientId, receiver: userId },
        ],
      }).sort({ createdAt: 1 }).exec();

      // Emit old messages to the user
      socket.emit('load old messages', messages);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  });

  // Handle incoming chat messages
  socket.on('chat message', async (msg) => {
    // Save message to MongoDB
    const newMessage = new Message(msg);
    newMessage.save().then(() => {
      console.log('Message saved to DB');
    });

    // Send message to recipient's room
    io.to(`${msg.receiver}-${msg.sender}`).emit('chat message', msg);
    io.to(`${msg.sender}-${msg.receiver}`).emit('chat message', msg);
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is listening at ${port}`);
});
