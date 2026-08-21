const { isAuthenticated } = require("./validators");
const notificationDB = require("../db/notification");

const getNotifications = [
  isAuthenticated(),
  async function (req, res) {
    const notifications = await notificationDB.getNotifications(req.user.id);

    res.json({ success: true, notifications });
  },
];

module.exports = { getNotifications };
