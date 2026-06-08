import { useEffect, useState } from "react";

function Home({ openAdminMode }) {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [customer, setCustomer] = useState({
    customerName: "",
    tableNumber: "",
    phone: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const API_URL = "http://127.0.0.1:5000/api";

  const fetchMenu = async () => {
    try {
      const response = await fetch(`${API_URL}/menu`);
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to load menu");
        return;
      }

      setMenu(data.menu || []);
    } catch (error) {
      setMessage("Backend is not running or menu API failed");
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const addToCart = (item) => {
    const exists = cart.find((cartItem) => cartItem.id === item.id);

    if (exists) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }

    setMessage(`${item.name} added to cart`);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const gst = Math.round(subtotal * 0.05);
  const serviceCharge = Math.round(subtotal * 0.03);
  const total = subtotal + gst + serviceCharge;

  const validateBill = () => {
    if (!customer.customerName.trim() || !customer.tableNumber.trim()) {
      alert("Please enter customer name and table number");
      return false;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return false;
    }

    return true;
  };

  const printBill = () => {
    if (!validateBill()) {
      return;
    }

    window.print();
  };

  const placeOrder = async () => {
    if (!validateBill()) {
      return;
    }

    const orderData = {
      customerName: customer.customerName,
      tableNumber: customer.tableNumber,
      phone: customer.phone,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category
      })),
      subtotal,
      gst,
      serviceCharge,
      total,
      paymentMethod
    };

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Order failed");
        return;
      }

      setMessage("Order placed successfully");
      setCart([]);
      setCustomer({
        customerName: "",
        tableNumber: "",
        phone: ""
      });
      setPaymentMethod("Cash");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      setMessage("Backend is not running or order API failed");
    }
  };

  const categories = ["All", ...new Set(menu.map((item) => item.category))];

  const filteredMenu = menu.filter((item) => {
    const matchesCategory = category === "All" || item.category === category;

    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="animated-page">
      <Receipt
        customer={customer}
        cart={cart}
        subtotal={subtotal}
        gst={gst}
        serviceCharge={serviceCharge}
        total={total}
        paymentMethod={paymentMethod}
      />

      <nav className="animated-navbar">
        <div className="brand-box">
          <div className="brand-logo">☕</div>

          <div>
            <h2>Paradise Cafe</h2>
            <p>Premium 3D Cafe Menu</p>
          </div>
        </div>

           <div className="nav-buttons">
            <button type="button" onClick={() => (window.location.href = "/feedback")}>
             Feedback
           </button>

            <button type="button" onClick={openAdminMode}>
             Admin Access
            </button>

            <button type="button" onClick={() => window.location.reload()}>
              Refresh
            </button>
            </div>
         
      </nav>

      <main className="main-container">
        <section className="hero-section">
          <div className="floating-food food-one">🍕</div>
          <div className="floating-food food-two">☕</div>
          <div className="floating-food food-three">🍔</div>
          <div className="floating-food food-four">🍰</div>

          <div className="hero-content">
            <span className="hero-badge">Animated 3D Cafe Website</span>

            <h1>Paradise Cafe</h1>

            <p>
              Modern cafe ordering system with animated 3D menu cards, live
              cart, smart billing, GST calculation, receipt printing, and
              MongoDB order storage.
            </p>

            <div className="hero-stats">
              <div>
                <strong>{menu.length || "10+"}</strong>
                <span>Menu Items</span>
              </div>

              <div>
                <strong>5%</strong>
                <span>GST Billing</span>
              </div>

              <div>
                <strong>Print</strong>
                <span>Receipt</span>
              </div>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-top">
              <span>Signature Dish</span>
              <small>Paradise Cafe</small>
            </div>

            <h2>Hawaiian Pineapple Pizza</h2>

            <p>
              Sweet pineapple chunks paired with savory cheese and rich tomato
              sauce.
            </p>

            <div className="hero-circle-text">
              <svg viewBox="0 0 260 260">
                <defs>
                  <path
                    id="heroCircle"
                    d="M 130,130 m -105,0 a 105,105 0 1,1 210,0 a 105,105 0 1,1 -210,0"
                  />
                </defs>

                <text>
                  <textPath href="#heroCircle">
                    PIZZA • COFFEE • BURGER • DESSERT • PARADISE CAFE •
                  </textPath>
                </text>
              </svg>

              <div className="hero-food-disc">🍕</div>
            </div>
          </div>
        </section>

        {message && <div className="message-box">{message}</div>}

        <section className="content-layout">
          <div className="menu-panel">
            <div className="menu-header">
              <div>
                <span>Explore Food</span>
                <h2>Premium Animated Menu</h2>
              </div>

              <input
                type="text"
                placeholder="Search food..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="category-tabs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={category === cat ? "active-tab" : ""}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="menu-grid">
              {filteredMenu.length > 0 ? (
                filteredMenu.map((item) => (
                  <MenuCard key={item.id} item={item} addToCart={addToCart} />
                ))
              ) : (
                <div className="empty-box">
                  No menu items found. Make sure backend is running.
                </div>
              )}
            </div>
          </div>

          <aside className="cart-panel">
            <div className="cart-heading">
              <div>
                <h2>Bill Summary</h2>
                <p>Smart cafe billing system</p>
              </div>

              <span>🧾</span>
            </div>

            <div className="customer-form">
              <input
                type="text"
                placeholder="Customer name"
                value={customer.customerName}
                onChange={(e) =>
                  setCustomer({ ...customer, customerName: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Table number"
                value={customer.tableNumber}
                onChange={(e) =>
                  setCustomer({ ...customer, tableNumber: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Phone optional"
                value={customer.phone}
                onChange={(e) =>
                  setCustomer({ ...customer, phone: e.target.value })
                }
              />

              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
              </select>
            </div>

            {cart.length === 0 ? (
              <div className="empty-box">🛒 No items added yet.</div>
            ) : (
              <>
                <div className="cart-list">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div>
                        <h4>{item.name}</h4>
                        <p>
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>

                      <div className="cart-actions">
                        <button onClick={() => decreaseQty(item.id)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => increaseQty(item.id)}>+</button>
                        <button onClick={() => removeItem(item.id)}>×</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bill-box">
                  <BillRow label="Subtotal" value={`₹${subtotal}`} />
                  <BillRow label="GST 5%" value={`₹${gst}`} />
                  <BillRow label="Service 3%" value={`₹${serviceCharge}`} />

                  <div className="total-row">
                    <strong>Total</strong>
                    <strong>₹{total}</strong>
                  </div>
                </div>

                <div className="bill-action-row">
                  <button className="print-bill-btn" onClick={printBill}>
                    Print Bill
                  </button>

                  <button className="place-order-btn" onClick={placeOrder}>
                    Place Order
                  </button>
                </div>
              </>
            )}
          </aside>
        </section>
      </main>
    </div>
  );
}

function MenuCard({ item, addToCart }) {
  const circleId = `circle-${item.id}`;

  return (
    <div className="menu-card">
      <div className="decor decor-left">✦</div>
      <div className="decor decor-right">✦</div>

      <span className="item-tag">{item.tag}</span>

      <h3>{item.name}</h3>

      <p>{item.description}</p>

      <div className="circle-food-wrap">
        <svg className="circle-svg" viewBox="0 0 240 240">
          <defs>
            <path
              id={circleId}
              d="M 120,120 m -96,0 a 96,96 0 1,1 192,0 a 96,96 0 1,1 -192,0"
            />
          </defs>

          <text>
            <textPath href={`#${circleId}`}>
              {`${item.category} • PARADISE CAFE • FRESH TASTE • PREMIUM • `}
            </textPath>
          </text>
        </svg>

        <div className="food-disc">
          <span>{item.icon}</span>
        </div>
      </div>

      <div className="card-bottom">
        <strong>₹{item.price}</strong>
        <button onClick={() => addToCart(item)}>Add</button>
      </div>
    </div>
  );
}

function BillRow({ label, value }) {
  return (
    <div className="bill-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Receipt({
  customer,
  cart,
  subtotal,
  gst,
  serviceCharge,
  total,
  paymentMethod
}) {
  const currentDate = new Date().toLocaleString();

  return (
    <div className="receipt-print-area">
      <div className="receipt-paper">
        <h1>Paradise Cafe</h1>
        <p>Fresh Taste, Happy Moments</p>

        <hr />

        <div className="receipt-info">
          <p>
            <strong>Date:</strong> {currentDate}
          </p>
          <p>
            <strong>Customer:</strong> {customer.customerName || "-"}
          </p>
          <p>
            <strong>Table:</strong> {customer.tableNumber || "-"}
          </p>
          <p>
            <strong>Phone:</strong> {customer.phone || "-"}
          </p>
          <p>
            <strong>Payment:</strong> {paymentMethod}
          </p>
        </div>

        <hr />

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Amt</th>
            </tr>
          </thead>

          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr />

        <div className="receipt-total">
          <p>
            <span>Subtotal</span>
            <strong>₹{subtotal}</strong>
          </p>

          <p>
            <span>GST 5%</span>
            <strong>₹{gst}</strong>
          </p>

          <p>
            <span>Service 3%</span>
            <strong>₹{serviceCharge}</strong>
          </p>

          <p className="grand-total">
            <span>Total</span>
            <strong>₹{total}</strong>
          </p>
        </div>

        <hr />

        <h3>Thank You! Visit Again ☕</h3>
      </div>
    </div>
  );
}

export default Home;