import { useEffect, useState } from "react";

function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/api";

  const goToHome = () => {
    window.location.href = "/";
  };

  const goToFeedback = () => {
    window.location.href = "/feedback";
  };

  const fetchFeedbacks = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/feedback`);
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to fetch feedback");
        setFeedbacks([]);
        return;
      }

      setFeedbacks(data.feedbacks || []);
    } catch (error) {
      setMessage("Backend is not running or feedback API failed");
      setFeedbacks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const deleteFeedback = async (id) => {
    const confirmDelete = window.confirm("Delete this feedback?");

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/feedback/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to delete feedback");
        return;
      }

      setMessage("Feedback deleted successfully");
      fetchFeedbacks();
    } catch (error) {
      setMessage("Failed to delete feedback");
    }
  };

  const averageRating =
    feedbacks.length === 0
      ? 0
      : (
          feedbacks.reduce((sum, item) => sum + Number(item.rating), 0) /
          feedbacks.length
        ).toFixed(1);

  return (
    <div className="feedback-page">
      <nav className="feedback-navbar">
        <div>
          <h2>Paradise Cafe</h2>
          <p>Admin Feedback Panel</p>
        </div>

        <div className="feedback-nav-actions">
          <button onClick={goToHome}>Back to Menu</button>
          <button onClick={goToFeedback}>Feedback Form</button>
          <button onClick={fetchFeedbacks}>Refresh</button>
        </div>
      </nav>

      <main className="feedback-main">
        <section className="admin-feedback-header">
          <div>
            <span>Customer Reviews</span>
            <h1>Admin Feedback Dashboard</h1>
            <p>
              View customer ratings, food quality feedback, service feedback and
              suggestions.
            </p>
          </div>
        </section>

        {message && <div className="feedback-message">{message}</div>}

        <section className="feedback-stats">
          <div>
            <span>Total Feedback</span>
            <h3>{feedbacks.length}</h3>
          </div>

          <div>
            <span>Average Rating</span>
            <h3>{averageRating} ★</h3>
          </div>
        </section>

        {loading ? (
          <div className="feedback-empty">Loading feedback...</div>
        ) : feedbacks.length === 0 ? (
          <div className="feedback-empty">
            No feedback found. Submit feedback first.
          </div>
        ) : (
          <section className="admin-feedback-grid">
            {feedbacks.map((feedback) => (
              <div key={feedback._id} className="admin-feedback-card">
                <div className="feedback-card-top">
                  <div>
                    <h3>{feedback.customerName}</h3>
                    <p>Phone: {feedback.phone || "Not provided"}</p>
                    <p>
                      Date:{" "}
                      {feedback.createdAt
                        ? new Date(feedback.createdAt).toLocaleDateString()
                        : "Not available"}
                    </p>
                  </div>

                  <span>{feedback.rating} ★</span>
                </div>

                <div className="quality-grid">
                  <div>
                    <strong>Food</strong>
                    <p>{feedback.foodQuality}</p>
                  </div>

                  <div>
                    <strong>Service</strong>
                    <p>{feedback.serviceQuality}</p>
                  </div>

                  <div>
                    <strong>Cleanliness</strong>
                    <p>{feedback.cleanliness}</p>
                  </div>
                </div>

                <div className="feedback-text-box">
                  <strong>Feedback:</strong>
                  <p>{feedback.message}</p>
                </div>

                <button
                  className="delete-feedback-btn"
                  onClick={() => deleteFeedback(feedback._id)}
                >
                  Delete Feedback
                </button>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminFeedback;