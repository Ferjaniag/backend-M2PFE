const userService = require("../services/userService");

const handleValidationError = (err, res) => {
  const errors = {};
  Object.keys(err.errors).forEach((field) => {
    errors[field] = err.errors[field].message;
  });

  res.status(400).send({
    success: false,
    message: "Validation failed",
    errors,
  });
};

const register = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const {
      name,
      email,
      phone,
      adress,
      password,
      role,
      businessCategory,
      subscriptionPeriod,
    } = req.body;
    const user = await userService.register({
      name,
      email,
      phone,
      adress,
      password,
      role,
      businessCategory,
      subscriptionPeriod,
    });
    res.status(201).send({ success: true, user: user });
  } catch (err) {
    console.log("error ", err);
    if (err.name === "ValidationError") {
      handleValidationError(err, res);
    } else if (err.name === "Error") {
      res.status(400).send({
        success: false,
        message: "Register failed",
        errors: err.message,
      });
    } else {
      res
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
  }
};

const approveAccess = async (req, res) => {
  const { userId, action } = req.body;
  console.log("test ", req.body);
  try {
    const result = await userService.approveAccess(userId, action);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in approveAccess controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateStatusUser = async (req, res) => {
  const { userId, role, status } = req.body;
  console.log("test ", req.body);
  try {
    const result = await userService.updateStatusUser(userId, role, status);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in update status controller:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const accessNewUser = async (req, res) => {
  const { email, name, role } = req.body;
  try {
    const result = await userService.addAccessUser(email, name, role);
    return res.status(200).send({ success: true, user: result });
  } catch (err) {
    console.log("error ", err);
    if (err.name === "ValidationError") {
      handleValidationError(err, res);
    } else if (err.name === "Error") {
      res.status(400).send({
        success: false,
        message: "Error access new user",
        errors: err.message,
      });
    } else {
      res
        .status(500)
        .send({ success: false, message: "Internal server error" });
    }
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

const getCustomersUsers = async (req, res) => {
  try {
    // Get all users with 'pending' status
    const CustomersUsers = await userService.getCustomersUsers();

    if (CustomersUsers.length === 0) {
      return res.status(404).json({ message: "No pending users found." });
    }

    // Send the list of pending users
    return res.status(200).json({ CustomersUsers });
  } catch (error) {
    // Handle any errors from the service
    console.error("Error fetching pending users:", error);
    return res.status(500).json({ message: error.message });
  }
};

const getExistingUsers = async (req, res) => {
  try {
    const role = req.params.role;

    const existingUsers = await userService.getExistingUsers(role);

    if (existingUsers.length === 0) {
      return res.status(404).json({ message: "No  users found." });
    }

    // Send the list of pending users
    return res.status(200).json({ existingUsers });
  } catch (error) {
    // Handle any errors from the service
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  approveAccess,
  getCustomersUsers,
  accessNewUser,
  getExistingUsers,
  updateStatusUser,
};
