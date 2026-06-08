const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      trim: true
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    foodQuality: {
      type: String,
      enum: ["Excellent", "Good", "Average", "Poor"],
      required: true
    },

    serviceQuality: {
      type: String,
      enum: ["Excellent", "Good", "Average", "Poor"],
      required: true
    },

    cleanliness: {
      type: String,
      enum: ["Excellent", "Good", "Average", "Poor"],
      required: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);