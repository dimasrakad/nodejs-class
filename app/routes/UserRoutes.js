const express = require("express");
const {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/UserController");

const router = express.Router();

router.route("/").post(createUser);
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

module.exports = router;
