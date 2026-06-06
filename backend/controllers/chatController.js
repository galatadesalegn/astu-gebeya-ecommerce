import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

export const startConversation = async (req, res) => {
    const { productId, sellerId, buyerId: buyerIdFromBody } = req.body;
    const currentUserId = req.user._id;

    // if buyerId is provided in body (seller starting chat), use it. Otherwise use current user (buyer starting chat)
    const buyerId = buyerIdFromBody || currentUserId;
    const actualSellerId = sellerId || currentUserId;

    try {
        let conversation = await Conversation.findOne({
            product: productId,
            participants: { $all: [buyerId, actualSellerId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                product: productId,
                participants: [buyerId, actualSellerId],
            });
        }

        res.status(201).json(conversation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user._id,
        })
            .populate('participants', 'name email role')
            .populate('product', 'title price image')
            .populate('lastMessage')
            .sort({ updatedAt: -1 });
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMessages = async (req, res) => {
    const { conversationId } = req.params;
    try {
        const messages = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const sendMessage = async (req, res) => {
    const { conversationId, text } = req.body;
    try {
        const message = await Message.create({
            conversation: conversationId,
            sender: req.user._id,
            text,
        });

        // Update last message in conversation
        await Conversation.findByIdAndUpdate(conversationId, { lastMessage: message._id });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const editMessage = async (req, res) => {
    const { messageId, text } = req.body;
    try {
        const message = await Message.findById(messageId);
        if (!message) return res.status(404).json({ message: 'Message not found' });
        if (message.sender.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to edit this message' });
        }
        message.text = text;
        message.isEdited = true;
        await message.save();
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteMessage = async (req, res) => {
    const { messageId } = req.params;
    try {
        const message = await Message.findById(messageId);
        if (!message) return res.status(404).json({ message: 'Message not found' });
        if (message.sender.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this message' });
        }

        const conversationId = message.conversation;
        await message.deleteOne();

        // Update conversation's lastMessage if needed
        const conversation = await Conversation.findById(conversationId);
        if (conversation && conversation.lastMessage && conversation.lastMessage.toString() === messageId) {
            const lastMsg = await Message.findOne({ conversation: conversationId }).sort({ createdAt: -1 });
            conversation.lastMessage = lastMsg ? lastMsg._id : null;
            await conversation.save();
        }

        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteConversation = async (req, res) => {
    const { conversationId } = req.params;
    try {
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
        if (!conversation.participants.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to delete this conversation' });
        }
        // Delete all messages in the conversation
        await Message.deleteMany({ conversation: conversationId });
        // Delete the conversation itself
        await conversation.deleteOne();
        res.json({ message: 'Conversation deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const markMessagesAsRead = async (req, res) => {
    const { conversationId } = req.params;
    try {
        await Message.updateMany(
            { conversation: conversationId, sender: { $ne: req.user._id }, isRead: false },
            { $set: { isRead: true } }
        );
        res.json({ message: 'Messages marked as read' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
