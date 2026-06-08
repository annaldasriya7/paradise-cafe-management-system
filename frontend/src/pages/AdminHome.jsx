function AdminHome({ closeAdminMode }) {
  return (
    <div className="admin-home-page">
      <nav className="admin-home-navbar">
        <div>
          <h2>Paradise Cafe</h2>
          <p>Admin Control Panel</p>
        </div>

        <button type="button" onClick={closeAdminMode}>
          Exit Admin Mode
        </button>
      </nav>

      <main className="admin-home-main">
        <section className="admin-home-hero">
          <div>
            <span>Admin Mode</span>
            <h1>Paradise Cafe Admin Panel</h1>
            <p>
              Admin can manage menu, feedback and sales reports from the same
              website URL.
            </p>
          </div>

          <div className="admin-home-hero-card">
            <div>🔐</div>
            <h3>Private Admin Area</h3>
            <p>Customer page and admin panel are on the same website.</p>
          </div>
        </section>

        <section className="admin-home-grid">
          <div className="admin-home-card">
            <div className="admin-home-card-icon">🍽️</div>
            <h3>Admin Menu Management</h3>
            <p>Add, edit and delete cafe menu items.</p>
            <button type="button" onClick={() => (window.location.href = "/admin/menu")}>
              Open
            </button>
          </div>

          <div className="admin-home-card">
            <div className="admin-home-card-icon">⭐</div>
            <h3>Admin Feedback</h3>
            <p>View customer feedback and ratings.</p>
            <button type="button" onClick={() => (window.location.href = "/admin/feedback")}>
              Open
            </button>
          </div>

          <div className="admin-home-card">
            <div className="admin-home-card-icon">📊</div>
            <h3>Sales Report</h3>
            <p>View revenue, orders and top selling items.</p>
            <button type="button" onClick={() => (window.location.href = "/sales-report")}>
              Open
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminHome;