import mongoose from 'mongoose';
import timestampPlugin from '../plugins/timestamp.js';

// Define the message schema
const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
});

// Apply timestamp plugin for createdAt and updatedAt fields
messageSchema.plugin(timestampPlugin);

// Create and export the 'Message' model based on the schema
const Message = mongoose.model('chat', messageSchema);

export default Message;
