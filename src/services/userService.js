const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { sendEmail } = require("./emailService");

const userService = {
  // Enregistrement d'un utilisateur client agence
  register: async (userData) => {
    const { name, email, phone, adress, password, role, businessCategory } =
      userData;
    // Vérification si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email déjà utilisé");
    }

    // Création du nouvel utilisateur
    const user = new User({
      name,
      phone,
      adress,
      email,
      password,
      businessCategory,
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
      throw new Error("Utilisateur non trouvé");
    }

    const isValidPassword = await user.isPasswordValid(password);
    if (!isValidPassword) {
      throw new Error("Mot de passe incorrect");
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
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
    const user = await User.findById(id);
    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }
    return user;
  },

  // Admin approves or rejects a user's access request
  approveAccess: async (userId, action) => {
    if (!userId || !action || !["approve", "reject"].includes(action)) {
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

      user.status = action === "approve" ? "approved" : "rejected";
      await user.save();

      return { message: `User access request ${action}d successfully.` };
    } catch (error) {
      console.error("Error approving/rejecting access:", error);
      throw new Error("Server error while processing request.");
    }
  },
  // get pending users
  getPendingUsers: async () => {
    try {
      // Find all users with status 'pending'
      const pendingUsers = await User.find({ status: "pending" });
      return pendingUsers;
    } catch (error) {
      throw new Error(error.message || "Error fetching pending users.");
    }
  },
};

module.exports = userService;
