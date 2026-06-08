const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true
    },

    icon: {
      type: String,
      default: "🍽️"
    },

    tag: {
      type: String,
      default: "Special"
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Menu", menuSchema);