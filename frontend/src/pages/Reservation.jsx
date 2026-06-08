import { useState } from "react";

function Reservation() {
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    guests: 1,
    reservationDate: "",
    reservationTime: "",
    specialRequest: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://127.0.0.1:5000/api";

  const goToMenu = () => {
    window.location.href = "/";
  };

  const goToAdminReservations = () => {
    window.location.href = "/admin/reservations";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const submitReservation = async (e) => {
    e.preventDefault();

    if (
      !formData.customerName.trim() ||
      !formData.phone.trim() ||
      !formData.guests ||
      !formData.reservationDate ||
      !formData.reservationTime
    ) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          guests: Number(formData.guests)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Reservation failed");
        return;
      }

      setMessage("Table reserved successfully. Admin will confirm your booking.");

      setFormData({
        customerName: "",
        phone: "",
        guests: 1,
        reservationDate: "",
        reservationTime: "",
        specialRequest: ""
      });
    } catch (error) {
      setMessage("Backend is not running or reservation API failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reservation-page">
      <nav className="reservation-nav">
        <div>
          <h2>Paradise Cafe</h2>
          <p>Table Reservation</p>
        </div>

        <div className="reservation-nav-actions">
          <button onClick={goToMenu}>Menu</button>
          <button onClick={goToAdminReservations}>Admin Reservations</button>
        </div>
      </nav>

      <main className="reservation-main">
        <section className="reservation-hero">
          <div>
            <span>Reserve Your Table</span>
            <h1>Book a Premium Cafe Experience</h1>
            <p>
              Reserve your table in advance and enjoy food, coffee, snacks and
              desserts without waiting.
            </p>
          </div>

          <div className="reservation-hero-card">
            <div>🍽️</div>
            <h3>Fast Table Booking</h3>
            <p>Fill details, choose date and time, then submit your booking.</p>
          </div>
        </section>

        {message && <div className="reservation-message">{message}</div>}

        <section className="reservation-layout">
          <form className="reservation-form" onSubmit={submitReservation}>
            <h2>Reservation Form</h2>

            <label>Customer Name</label>
            <input
              type="text"
              name="customerName"
              placeholder="Enter your name"
              value={formData.customerName}
              onChange={handleChange}
            />

            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />

            <label>Number of Guests</label>
            <input
              type="number"
              name="guests"
              min="1"
              placeholder="Guests"
              value={formData.guests}
              onChange={handleChange}
            />

            <div className="reservation-row">
              <div>
                <label>Date</label>
                <input
                  type="date"
                  name="reservationDate"
                  value={formData.reservationDate}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Time</label>
                <input
                  type="time"
                  name="reservationTime"
                  value={formData.reservationTime}
                  onChange={handleChange}
                />
              </div>
            </div>

            <label>Special Request</label>
            <textarea
              name="specialRequest"
              placeholder="Birthday table, window seat, decoration etc."
              value={formData.specialRequest}
              onChange={handleChange}
            ></textarea>

            <button type="submit" disabled={loading}>
              {loading ? "Booking..." : "Reserve Table"}
            </button>
          </form>

          <div className="reservation-info-card">
            <h2>Why Reserve?</h2>

            <div>
              <span>✅</span>
              <p>No waiting for table during busy time.</p>
            </div>

            <div>
              <span>✅</span>
              <p>Admin can confirm reservation status.</p>
            </div>

            <div>
              <span>✅</span>
              <p>Useful feature for major project presentation.</p>
            </div>

            <div>
              <span>✅</span>
              <p>Data is saved in MongoDB Atlas.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Reservation;