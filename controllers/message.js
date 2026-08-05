const validator = require("./validators");
const messageDB = require("../db/message");
const pictureDB = require("../db/picture");
const cloudinary = require("cloudinary").v2;

const multer = require("multer");
const InvalidArgumentError = require("../errors/InvalidArgumentError");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 512,
    files: 5,
  },
  fileFilter: function (req, file, cb) {
    cb(null, true);
  },
}).array("pictures");

cloudinary.config();

const uploadPicture = async (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          format: "jpg",
        },
        (error, uploadResult) => {
          if (error) {
            return reject(error);
          }
          return resolve(uploadResult);
        },
      )
      .end(buffer);
  });
};

const uploadPictures = async (messageId, files) => {
  for (const file of files) {
    const uploadResult = await uploadPicture(file.buffer);

    await pictureDB.uploadMessagePicture(
      messageId,
      uploadResult.url,
      uploadResult.public_id,
    );
  }
};

const addMessagePictures = async (messages) => {
  for (const message of messages) {
    const pictures = await pictureDB.getMessagePictures(message.id);

    if (pictures.length > 0) {
      message.pictures = pictures;
    }
  }
};

const sendMessage = [
  upload,
  validator.isAuthenticated(),
  validator.isFriend(),
  validator.checkValidations(),
  function (req, res, next) {
    const { body } = req.body;
    const files = req.files;

    if (
      (typeof body === "undefined" || body.trim() === "") &&
      files.length === 0
    ) {
      throw new InvalidArgumentError(
        "'body' and 'message-pictures' can't be empty at the same time.",
      );
    }

    if (typeof body !== "undefined") {
      if (body.trim().length > 250) {
        throw new InvalidArgumentError(
          `'body' must be between 0 and 250 characters inclusive.`,
        );
      }
      req.body.body = body.trim();
    }

    next();
  },
  async function (req, res) {
    const senderId = req.user.id;
    const receiverId = req.params.userId;
    const files = req.files;

    const messageId = await messageDB.sendMessage(
      senderId,
      receiverId,
      req.body.body,
      new Date(),
    );

    await uploadPictures(messageId, req.files);
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
    await addMessagePictures(messages);

    await messageDB.updateChatLastSeen(userId1, userId2, new Date());

    const response = {
      messages: messages.map((message) => ({
        id: message.id,
        userId: message.sender_id,
        name: message.name,
        body: message.body,
        createdAt: message.created_at,
        pictures: message.pictures,
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
    const deletedPictures = await pictureDB.getMessagePictures(
      req.params.messageId,
    );
    const deletedMessage = await messageDB.deleteMessage(req.params.messageId);

    if (!deletedMessage) {
      throw new Error("Error deleting message");
    }

    for (const deletedPicture of deletedPictures) {
      if (deletedPicture.public_id !== null) {
        await cloudinary.uploader.destroy(deletedPicture.public_id, {
          resource_type: "image",
        });
      }
    }

    return res.status(200).json({ success: true });
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
