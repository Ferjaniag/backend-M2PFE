const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    adress: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: (props) => props.value + " n'est pas un email valide!",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [8, "Le mot de passe doit contenir au moins 8 caractères"],
      validate: {
        validator: function (value) {
          // Validation pour un mot de passe avec au moins une lettre majuscule, une minuscule, un chiffre et un caractère spécial
          return (
            /[A-Z]/.test(value) &&
            /[a-z]/.test(value) &&
            /[0-9]/.test(value) &&
            /[!@#$%^&*]/.test(value)
          );
        },
        message:
          "Le mot de passe doit contenir au moins une lettre majuscule, une minuscule, un chiffre et un caractère spécial (!@#$%^&*)",
      },
    },
    // Business Information (For Agencies)
    businessCategory: {
      type: String,
      default: null,
    },

    // Role and Status
    role: {
      type: String,
      enum: ["admin", "customer", "consumer"], // Roles: admin, agency, or app user
      default: "consumer",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"], // Approval status
      default: "pending",
    },

    approvedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },

    // Optional fields for customization
    profilePicture: {
      type: String,
      default: null, // Path or URL to the user's profile picture
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Avant de sauvegarder, on hashe le mot de passe
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Méthode pour vérifier si un mot de passe est valide
userSchema.methods.isPasswordValid = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
