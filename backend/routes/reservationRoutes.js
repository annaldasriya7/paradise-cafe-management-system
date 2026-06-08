const express = require("express");
const Reservation = require("../models/Reservation");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      phone,
      guests,
      reservationDate,
      reservationTime,
      specialRequest
    } = req.body;

    if (!customerName || !phone || !guests || !reservationDate || !reservationTime) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, guests, date and time are required"
      });
    }

    const reservation = await Reservation.create({
      customerName,
      phone,
      guests,
      reservationDate,
      reservationTime,
      specialRequest
    });

    return res.status(201).json({
      success: true,
      message: "Table reservation created successfully",
      reservation
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reservations.length,
      reservations
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true
      }
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reservation status updated",
      reservation
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found"
      });
    }

    await reservation.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Reservation deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;