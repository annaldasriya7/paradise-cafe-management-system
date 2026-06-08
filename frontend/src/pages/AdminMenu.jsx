import { useEffect, useState } from "react";

function AdminMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    icon: "🍽️",
    tag: "Special",
    description: "",
    isAvailable: true
  });

  const API_URL = "http://127.0.0.1:5000/api";

  const goToHome = () => {
    window.location.href = "/";
  };

  const fetchMenuItems = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/menu/all`);
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to load menu items");
        setMenuItems([]);
        return;
      }

      setMenuItems(data.menu || []);
    } catch (error) {
      setMessage("Backend is not running or menu API failed");
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      name: "",
      category: "",
      price: "",
      icon: "🍽️",
      tag: "Special",
      description: "",
      isAvailable: true
    });
  };

  const saveMenuItem = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.category.trim() ||
      !formData.price ||
      !formData.description.trim()
    ) {
      alert("Name, category, price and description are required");
      return;
    }

    const menuData = {
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      icon: formData.icon || "🍽️",
      tag: formData.tag || "Special",
      description: formData.description,
      isAvailable: formData.isAvailable
    };

    try {
      const url = editingId
        ? `${API_URL}/menu/${editingId}`
        : `${API_URL}/menu`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(menuData)
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to save menu item");
        return;
      }

      setMessage(
        editingId
          ? "Menu item updated successfully"
          : "Menu item added successfully"
      );

      resetForm();
      fetchMenuItems();
    } catch (error) {
      setMessage("Backend is not running or save API failed");
    }
  };

  const editMenuItem = (item) => {
    setEditingId(item._id);

    setFormData({
      name: item.name || "",
      category: item.category || "",
      price: item.price || "",
      icon: item.icon || "🍽️",
      tag: item.tag || "Special",
      description: item.description || "",
      isAvailable:
        typeof item.isAvailable === "boolean" ? item.isAvailable : true
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteMenuItem = async (id) => {
    const confirmDelete = window.confirm("Delete this menu item?");

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/menu/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to delete menu item");
        return;
      }

      setMessage("Menu item deleted successfully");
      fetchMenuItems();
    } catch (error) {
      setMessage("Backend is not running or delete API failed");
    }
  };

  return (
    <div className="admin-menu-page">
      <nav className="admin-menu-navbar">
        <div>
          <h2>Paradise Cafe</h2>
          <p>Admin Menu Management</p>
        </div>

        <div className="admin-menu-nav-actions">
          <button onClick={goToHome}>Back to Website</button>
          <button onClick={fetchMenuItems}>Refresh</button>
        </div>
      </nav>

      <main className="admin-menu-main">
        <section className="admin-menu-hero">
          <div>
            <span>MongoDB Menu Control</span>
            <h1>Admin Menu Management</h1>
            <p>
              Add, edit, delete and manage cafe menu items directly from the
              website. All menu data is saved in MongoDB.
            </p>
          </div>

          <div className="admin-menu-hero-card">
            <div>🍽️</div>
            <h3>Dynamic Menu</h3>
            <p>No need to edit backend code for menu changes.</p>
          </div>
        </section>

        {message && <div className="admin-menu-message">{message}</div>}

        <section className="admin-menu-layout">
          <form className="admin-menu-form" onSubmit={saveMenuItem}>
            <h2>{editingId ? "Edit Menu Item" : "Add New Menu Item"}</h2>

            <label>Food Name</label>
            <input
              type="text"
              name="name"
              placeholder="Example: Oreo Shake"
              value={formData.name}
              onChange={handleChange}
            />

            <label>Category</label>
            <input
              type="text"
              name="category"
              placeholder="Example: Beverages"
              value={formData.category}
              onChange={handleChange}
            />

            <label>Price</label>
            <input
              type="number"
              name="price"
              placeholder="Example: 149"
              value={formData.price}
              onChange={handleChange}
            />

            <div className="admin-menu-row">
              <div>
                <label>Icon Emoji</label>
                <input
                  type="text"
                  name="icon"
                  placeholder="Example: 🥤"
                  value={formData.icon}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Tag</label>
                <input
                  type="text"
                  name="tag"
                  placeholder="Example: New"
                  value={formData.tag}
                  onChange={handleChange}
                />
              </div>
            </div>

            <label>Description</label>
            <textarea
              name="description"
              placeholder="Enter food description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>

            <label className="availability-check">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
              />
              Available on menu
            </label>

            <div className="admin-menu-form-actions">
              <button type="submit">
                {editingId ? "Update Item" : "Add Item"}
              </button>

              {editingId && (
                <button type="button" onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          <div className="admin-menu-list-section">
            <div className="admin-menu-list-header">
              <div>
                <h2>Menu Items</h2>
                <p>Total items: {menuItems.length}</p>
              </div>
            </div>

            {loading ? (
              <div className="admin-menu-empty">Loading menu items...</div>
            ) : menuItems.length === 0 ? (
              <div className="admin-menu-empty">
                No menu items found. Add your first menu item.
              </div>
            ) : (
              <div className="admin-menu-grid">
                {menuItems.map((item) => (
                  <div key={item._id} className="admin-menu-card">
                    <div className="admin-menu-card-top">
                      <div className="admin-menu-icon">{item.icon}</div>

                      <span
                        className={
                          item.isAvailable
                            ? "availability available"
                            : "availability unavailable"
                        }
                      >
                        {item.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    <h3>{item.name}</h3>

                    <p>{item.description}</p>

                    <div className="admin-menu-meta">
                      <span>{item.category}</span>
                      <span>{item.tag}</span>
                    </div>

                    <div className="admin-menu-price-row">
                      <strong>₹{item.price}</strong>
                    </div>

                    <div className="admin-menu-card-actions">
                      <button onClick={() => editMenuItem(item)}>Edit</button>
                      <button onClick={() => deleteMenuItem(item._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminMenu;