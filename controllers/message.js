const validator = require("./validators");
const messageDB = require("../db/message");

const sendMessage = [
  validator.isAuthenticated(),
  validator.isFriend(),
  validator.validateBodyStringLength("body", 1, 250),
  validator.checkValidations(),
  async function (req, res) {
    const senderId = req.user.id;
    const receiverId = req.params.userId;

    const messageId = await messageDB.sendMessage(
      senderId,
      receiverId,
      req.body.body,
      new Date(),
    );

    await messageDB.updateChatLastSeen(senderId, receiverId, new Date());

    if (messageId) {
      res.status(200).json({ message: "success" });
    } else {
      throw new Error("Error sending message");
    }
  },
];

const getChat = [
  validator.isAuthenticated(),
  validator.isFriend(),
  validator.checkValidations(),
  async function (req, res) {
    const userId1 = req.user.id;
    const userId2 = req.params.userId;

    const messages = await messageDB.getChat(userId1, userId2);

    await messageDB.updateChatLastSeen(userId1, userId2, new Date());

    const response = {
      messages: messages.map((message) => ({
        id: message.id,
        userId: message.sender_id,
        name: message.name,
        body: message.body,
        createdAt: message.created_at,
      })),
    };

    res.status(200).json(response);
  },
];

const deleteMessage = [
  validator.isAuthenticated(),
  validator.isMessageOwner(),
  validator.checkValidations(),
  async function (req, res) {
    const result = await messageDB.deleteMessage(req.params.messageId);

    if (result) {
      return res.status(200).json({ success: true });
    } else {
      throw new Error("Error deleting message");
    }
  },
];

const getChats = [
  validator.isAuthenticated(),
  async function (req, res) {
    const chats = await messageDB.getChats(req.user.id);

    res.status(200).json({
      chats: chats.map((c) => ({
        id: c.id,
        name: c.name,
        lastActive: c.last_active,
        lastMessageTime: c.last_message_time,
        unreadCount: c.unread_count,
      })),
    });
  },
];

module.exports = {
  sendMessage,
  getChat,
  deleteMessage,
  getChats,
};
