const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

// Route pour enregistrer un utilisateur
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/admin/approve-access", userController.approveAccess);
router.get("/pending_users", userController.getPendingUsers);
// Route protégée par authMiddleware
router.get("/getuserbyid/:id", authMiddleware, (req, res) => {
  res.status(200).send({ message: "Vous êtes authentifié", user: req.user });
});
module.exports = router;
