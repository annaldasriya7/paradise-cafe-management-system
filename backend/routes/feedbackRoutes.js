const express = require("express");
const Feedback = require("../models/Feedback");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      phone,
      rating,
      foodQuality,
      serviceQuality,
      cleanliness,
      message
    } = req.body;

    if (
      !customerName ||
      !rating ||
      !foodQuality ||
      !serviceQuality ||
      !cleanliness ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required feedback fields"
      });
    }

    const feedback = await Feedback.create({
      customerName,
      phone,
      rating,
      foodQuality,
      serviceQuality,
      cleanliness,
      message
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback
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
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: feedbacks.length,
      feedbacks
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
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found"
      });
    }

    await feedback.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Feedback deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;