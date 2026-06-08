const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    guests: {
      type: Number,
      required: true,
      min: 1
    },

    reservationDate: {
      type: String,
      required: true
    },

    reservationTime: {
      type: String,
      required: true
    },

    specialRequest: {
      type: String,
      trim: true
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Reservation", reservationSchema);