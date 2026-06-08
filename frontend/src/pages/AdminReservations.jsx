import { useEffect, useState } from "react";

function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://127.0.0.1:5000/api";

  const goToMenu = () => {
    window.location.href = "/";
  };

  const goToReservation = () => {
    window.location.href = "/reservation";
  };

  const fetchReservations = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/reservations`);
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to fetch reservations");
        setReservations([]);
        return;
      }

      setReservations(data.reservations || []);
    } catch (error) {
      setMessage("Backend is not running or reservation API failed");
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_URL}/reservations/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update reservation");
        return;
      }

      setMessage("Reservation status updated");
      fetchReservations();
    } catch (error) {
      setMessage("Failed to update reservation");
    }
  };

  const deleteReservation = async (id) => {
    const confirmDelete = window.confirm("Delete this reservation?");

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/reservations/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to delete reservation");
        return;
      }

      setMessage("Reservation deleted successfully");
      fetchReservations();
    } catch (error) {
      setMessage("Failed to delete reservation");
    }
  };

  return (
    <div className="reservation-page">
      <nav className="reservation-nav">
        <div>
          <h2>Paradise Cafe</h2>
          <p>Admin Reservations</p>
        </div>

        <div className="reservation-nav-actions">
          <button onClick={goToMenu}>Menu</button>
          <button onClick={goToReservation}>Reservation Form</button>
          <button onClick={fetchReservations}>Refresh</button>
        </div>
      </nav>

      <main className="reservation-main">
        <div className="admin-reservation-header">
          <h1>Admin Reservations</h1>
          <p>Confirm, complete, cancel or delete customer reservations.</p>
        </div>

        {message && <div className="reservation-message">{message}</div>}

        {loading ? (
          <div className="reservation-empty">Loading reservations...</div>
        ) : reservations.length === 0 ? (
          <div className="reservation-empty">
            No reservations found. Create a reservation first.
          </div>
        ) : (
          <section className="reservation-grid">
            {reservations.map((reservation) => (
              <div key={reservation._id} className="reservation-card">
                <div className="reservation-card-top">
                  <div>
                    <h3>{reservation.customerName}</h3>
                    <p>Phone: {reservation.phone}</p>
                    <p>Guests: {reservation.guests}</p>
                    <p>
                      Date: {reservation.reservationDate} at{" "}
                      {reservation.reservationTime}
                    </p>
                  </div>

                  <span
                    className={`reservation-status ${reservation.status.toLowerCase()}`}
                  >
                    {reservation.status}
                  </span>
                </div>

                {reservation.specialRequest && (
                  <div className="special-request-box">
                    <strong>Request:</strong> {reservation.specialRequest}
                  </div>
                )}

                <div className="reservation-actions">
                  <select
                    value={reservation.status}
                    onChange={(e) =>
                      updateStatus(reservation._id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  <button onClick={() => deleteReservation(reservation._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default AdminReservations;