import { useState } from "react";

function Feedback() {
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    rating: 5,
    foodQuality: "Excellent",
    serviceQuality: "Excellent",
    cleanliness: "Excellent",
    message: ""
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://127.0.0.1:5000/api";

  const goToHome = () => {
    window.location.href = "/";
  };

  const goToAdminFeedback = () => {
    window.location.href = "/admin/feedback";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const submitFeedback = async (e) => {
    e.preventDefault();

    if (!formData.customerName.trim() || !formData.message.trim()) {
      alert("Please enter customer name and feedback message");
      return;
    }

    setLoading(true);
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          rating: Number(formData.rating)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setSuccessMessage(data.message || "Feedback submission failed");
        return;
      }

      setSuccessMessage("Thank you! Your feedback submitted successfully.");

      setFormData({
        customerName: "",
        phone: "",
        rating: 5,
        foodQuality: "Excellent",
        serviceQuality: "Excellent",
        cleanliness: "Excellent",
        message: ""
      });
    } catch (error) {
      setSuccessMessage("Backend is not running or feedback API failed");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className={Number(formData.rating) >= i ? "star active-star" : "star"}
          onClick={() =>
            setFormData({
              ...formData,
              rating: i
            })
          }
        >
          ★
        </button>
      );
    }

    return stars;
  };

  return (
    <div className="feedback-page">
      <nav className="feedback-navbar">
        <div>
          <h2>Paradise Cafe</h2>
          <p>Customer Feedback</p>
        </div>

        <div className="feedback-nav-actions">
          <button onClick={goToHome}>Back to Menu</button>
          <button onClick={goToAdminFeedback}>Admin Feedback</button>
        </div>
      </nav>

      <main className="feedback-main">
        <section className="feedback-hero">
          <div>
            <span>Customer Experience</span>
            <h1>Share Your Feedback</h1>
            <p>
              Your feedback helps Paradise Cafe improve food quality, service,
              cleanliness and customer satisfaction.
            </p>
          </div>

          <div className="feedback-hero-card">
            <div>⭐</div>
            <h3>Rate Your Experience</h3>
            <p>Give rating and suggestions for better service.</p>
          </div>
        </section>

        {successMessage && (
          <div className="feedback-message">{successMessage}</div>
        )}

        <section className="feedback-layout">
          <form className="feedback-form" onSubmit={submitFeedback}>
            <h2>Feedback Form</h2>

            <label>Customer Name</label>
            <input
              type="text"
              name="customerName"
              placeholder="Enter your name"
              value={formData.customerName}
              onChange={handleChange}
            />

            <label>Phone Number Optional</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />

            <label>Overall Rating</label>
            <div className="star-rating">{renderStars()}</div>

            <div className="feedback-row">
              <div>
                <label>Food Quality</label>
                <select
                  name="foodQuality"
                  value={formData.foodQuality}
                  onChange={handleChange}
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Average">Average</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              <div>
                <label>Service Quality</label>
                <select
                  name="serviceQuality"
                  value={formData.serviceQuality}
                  onChange={handleChange}
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Average">Average</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
            </div>

            <label>Cleanliness</label>
            <select
              name="cleanliness"
              value={formData.cleanliness}
              onChange={handleChange}
            >
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Poor">Poor</option>
            </select>

            <label>Your Feedback</label>
            <textarea
              name="message"
              placeholder="Write your experience..."
              value={formData.message}
              onChange={handleChange}
            ></textarea>

            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>

          <div className="feedback-info-card">
            <h2>Why Feedback Matters?</h2>

            <div>
              <span>🍕</span>
              <p>Helps improve food quality and taste.</p>
            </div>

            <div>
              <span>🤝</span>
              <p>Helps improve customer service.</p>
            </div>

            <div>
              <span>🧹</span>
              <p>Helps maintain cleanliness and hygiene.</p>
            </div>

            <div>
              <span>⭐</span>
              <p>Useful for admin analysis and project presentation.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Feedback;