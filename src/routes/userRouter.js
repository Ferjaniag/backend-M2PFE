const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/admin/approve-access", userController.approveAccess);
router.get("/pending_users", userController.getPendingUsers);
router.get("/users/:role", userController.getExistingUsers);
router.post("/access_user", userController.accessNewUser);
router.put("/update_status", userController.updateStatusUser);
// Route protégée par authMiddleware
router.get("/getuserbyid/:id", authMiddleware, (req, res) => {
  res.status(200).send({ message: "Vous êtes authentifié", user: req.user });
});
module.exports = router;
