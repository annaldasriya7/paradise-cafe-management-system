const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    id: Number,
    name: String,
    price: Number,
    quantity: Number,
    category: String
  },
  {
    _id: false
  }
);

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true
    },

    tableNumber: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      trim: true
    },

    items: {
      type: [orderItemSchema],
      required: true
    },

    subtotal: {
      type: Number,
      required: true
    },

    gst: {
      type: Number,
      required: true
    },

    serviceCharge: {
      type: Number,
      required: true
    },

    total: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Card"],
      default: "Cash"
    },

    status: {
      type: String,
      enum: ["Pending", "Preparing", "Completed", "Cancelled"],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", orderSchema);