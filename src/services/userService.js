const User = require("../models/user");
const jwt = require("jsonwebtoken");
var generator = require("generate-password");

require("dotenv").config();
const { sendEmail } = require("./emailService");

const userService = {
  // Enregistrement d'un utilisateur client agence
  register: async (userData) => {
    const {
      name,
      email,
      phone,
      adress,
      password,
      role,
      businessCategory,
      subscriptionPeriod,
    } = userData;
    // Vérification si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Création du nouvel utilisateur
    const user = new User({
      name,
      phone,
      adress,
      email,
      password,
      businessCategory,
      subscriptionPeriod,
      role,
    });
    await user.save();

    // Send email notification to admin about the new access request
    const adminEmail = process.env.ADMIN_EMAIL; // Get the admin email from environment variable
    const subject = "New Access Request";
    const text = `Hello Admin,

A new user, ${name}, has requested access to the platform. Please review their details and take appropriate action.

User's Contact Information:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}
- Address: ${adress}

Thank you.`;

    const html = `<p>Hello Admin,</p>
<p>A new user, <strong>${name}</strong>, has requested access to the platform. Please review their details and take appropriate action.</p>

<p><strong>User's Contact Information:</strong></p>
<ul>
  <li><strong>Name:</strong> ${name}</li>
  <li><strong>Email:</strong> ${email}</li>
  <li><strong>Phone:</strong> ${phone}</li>
  <li><strong>Address:</strong> ${adress}</li>
</ul>

<p>Thank you.</p>`;

    await sendEmail(email, adminEmail, subject, text, html);
    return user;
  },

  // Connexion d'un utilisateur
  login: async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    if (user.status === "pending") {
      throw new Error("User not approved yet !");
    } else if (user.status === "desactivate") {
      throw new Error("Your account is desactivated !");
    }

    const isValidPassword = await user.isPasswordValid(password);
    if (!isValidPassword) {
      throw new Error("Password or email incorrect!");
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return { token };
  },

  // Trouver un utilisateur par son email
  findByEmail: async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    return user;
  },

  // Trouver un utilisateur par son ID
  findById: async (id) => {
    const user = await User.findById(id).populate("businessCategory");
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    return user;
  },

  // Admin approves or rejects a user's access request
  approveAccess: async (userId, action) => {
    if (!userId || !action || !["Approve", "Reject"].includes(action)) {
      throw new Error(
        "Invalid request. Ensure userId and action (approve/reject) are provided."
      );
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found.");
      }
      if (user.status !== "pending") {
        console.log("user statuss ", user.status);
        throw new Error("User access request is already processed.");
      }

      user.status = action === "Approve" ? "approved" : "rejected";
      const decision = action === "Approve" ? "approved" : "rejected";
      const adminEmail = process.env.ADMIN_EMAIL; // Get the admin email from environment variable
      const subject = "Update decision for request access";
      const text = `Hello ${user.name},

Your request for access to the platform has been ${decision}
Thank you.`;

      const html = `<p>Hello ${user.name},</p>
<p>Your request for access to the platform has been <strong>${decision}</strong>, </p>
<p>Thank you.</p>`;
      console.log("email user ", user.email);
      await user.save();
      await sendEmail(adminEmail, user.email, subject, text, html);
      return { message: `User access request ${action}d successfully.` };
    } catch (error) {
      console.error("Error approving/rejecting access:", error);
      throw new Error("Server error while processing request.");
    } finally {
    }
  },

  // update status user

  updateStatusUser: async (userId, role, status) => {
    if (!userId || !status || !["activate", "desactivate"].includes(status)) {
      throw new Error(
        "Invalid request. Ensure userId and action (approve/reject) are provided."
      );
    }

    try {
      const user = await User.findOne({ _id: userId, role: role });
      if (!user) {
        throw new Error("User not found.");
      }
      if (user.status == status) {
        console.log("user statuss ", user.status);
        throw new Error("User status is already processed.");
      }

      user.status = status;

      await user.save();

      return { message: `User  ${status}d successfully.` };
    } catch (error) {
      console.error("Error update status access:", error);
      throw new Error("Server error while processing request.");
    } finally {
    }
  },
  // get pending users
  getPendingUsers: async () => {
    try {
      // Find all users with status 'pending'
      const pendingUsers = await User.find({
        status: "pending",
        role: "customer",
      })
        .populate("businessCategory")
        .sort({ createdAt: -1 });
      return pendingUsers;
    } catch (error) {
      throw new Error(error.message || "Error fetching pending users.");
    }
  },

  getExistingUsers: async (role) => {
    try {
      const existingUsers = await User.find({
        role: role,
      }).sort({ createdAt: -1 });
      return existingUsers;
    } catch (error) {
      throw new Error(error.message || "Error fetching existing users.");
    }
  },

  // give access to admin

  addAccessUser: async (email, name, role) => {
    // Vérification si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const generatedPassword = generator.generate({
      length: 10,
      strict: true,
      numbers: true,
      symbols: true,
    });

    // [ 'hnwulsekqn', 'qlioullgew', 'kosxwabgjv' ]
    console.log("Generated password: " + generatedPassword);
    console.log("emaill from service ", email);
    const user = new User({
      name: name,
      email: email,
      password: generatedPassword,
      role: role,
    });

    await user.save();

    const adminEmail = process.env.ADMIN_EMAIL; // Get the admin email from environment variable
    const subject = "Crediantials to access plateform";
    const text = `Hello ${name},

The superadmin has given you access to the platform.
 Here are your credentials:

- Name: ${name}
- Email: ${email}
- Password: ${generatedPassword}


Thank you.`;

    const html = `<p>Crediantials to access plateform</p>
<p>The superadmin has given you access to the platform.</p>

<p><strong>Here are your credentials:</strong></p>
<ul>
  <li><strong>Name:</strong> ${name}</li>
  <li><strong>Email:</strong> ${email}</li>
  <li><strong>Password:</strong> ${generatedPassword}</li>

</ul>

<p>Thank you.</p>`;

    await sendEmail(adminEmail, email, subject, text, html);
    return user;
  },
};

module.exports = userService;
