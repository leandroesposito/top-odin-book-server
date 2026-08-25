const userDB = require("../db/user");
const { isAuthenticated } = require("./validators");

const deleteAccount = [
  isAuthenticated(),
  async function (req, res) {
    const deletedId = await userDB.deleteUserById(req.user.id);

    if (deletedId) {
      return res.json({
        success: true,
        message: `User deleted successfully`,
        delete: true,
      });
    }

    throw new Error("Error deleting user");
  },
];

module.exports = { deleteAccount };
