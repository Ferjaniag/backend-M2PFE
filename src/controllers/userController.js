const userService = require("../services/userService");


const register = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Debugging line
    const { name, email, phone, adress, password, role, businessCategory } =
      req.body;
    const user = await userService.register({
      name,
      email,
      phone,
      adress,
      password,
      role,
      businessCategory,
    });
    res.status(201).send({ user });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

const approveAccess = async (req, res) => {
  const { userId, action } = req.body;

  try {
    const result = await userService.approveAccess(userId, action); // Do not pass res here
    return res.status(200).json(result); // Handle the response here
  } catch (error) {
    console.error("Error in approveAccess controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Route de connexion
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await userService.login(email, password);
    res.status(200).send({ user, token });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
};

const getPendingUsers = async (req, res) => {
  try {
    // Get all users with 'pending' status
    const pendingUsers = await userService.getPendingUsers();

    if (pendingUsers.length === 0) {
      return res.status(404).json({ message: "No pending users found." });
    }

    // Send the list of pending users
    return res.status(200).json({ pendingUsers });
  } catch (error) {
    // Handle any errors from the service
    console.error("Error fetching pending users:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  approveAccess,
  getPendingUsers,
};
