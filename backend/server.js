const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json());

const menuItems = [
  {
    id: 1,
    name: "Hawaiian Pineapple Pizza",
    category: "Pizza",
    price: 299,
    icon: "🍕",
    tag: "Chef Special",
    description: "Sweet pineapple chunks paired with savory cheese and rich tomato sauce.",
    isAvailable: true
  },
  {
    id: 2,
    name: "Margherita Pizza",
    category: "Pizza",
    price: 249,
    icon: "🍕",
    tag: "Classic",
    description: "Fresh mozzarella, basil, tomato sauce, and crispy golden crust.",
    isAvailable: true
  },
  {
    id: 3,
    name: "Veggie Supreme Pizza",
    category: "Pizza",
    price: 279,
    icon: "🍕",
    tag: "Popular",
    description: "Loaded with capsicum, onion, olives, corn, tomato, and extra cheese.",
    isAvailable: true
  },
  {
    id: 4,
    name: "Cold Coffee",
    category: "Beverages",
    price: 99,
    icon: "☕",
    tag: "Chilled",
    description: "Creamy cold coffee blended with chocolate syrup and ice cream.",
    isAvailable: true
  },
  {
    id: 5,
    name: "Cappuccino",
    category: "Beverages",
    price: 129,
    icon: "🍵",
    tag: "Hot",
    description: "Rich espresso topped with steamed milk foam and cocoa dust.",
    isAvailable: true
  },
  {
    id: 6,
    name: "Cheese Burger",
    category: "Fast Food",
    price: 159,
    icon: "🍔",
    tag: "Crispy",
    description: "Soft bun stuffed with cheese patty, lettuce, onion, and house sauce.",
    isAvailable: true
  },
  {
    id: 7,
    name: "French Fries",
    category: "Snacks",
    price: 89,
    icon: "🍟",
    tag: "Crunchy",
    description: "Golden crispy potato fries served with spicy tomato dip.",
    isAvailable: true
  },
  {
    id: 8,
    name: "Veg Sandwich",
    category: "Snacks",
    price: 119,
    icon: "🥪",
    tag: "Fresh",
    description: "Grilled sandwich with fresh vegetables, cheese, and mint chutney.",
    isAvailable: true
  },
  {
    id: 9,
    name: "Chocolate Cake",
    category: "Dessert",
    price: 139,
    icon: "🍰",
    tag: "Sweet",
    description: "Soft chocolate sponge layered with creamy chocolate frosting.",
    isAvailable: true
  },
  {
    id: 10,
    name: "Vanilla Ice Cream",
    category: "Dessert",
    price: 79,
    icon: "🍨",
    tag: "Cool",
    description: "Classic vanilla ice cream scoop with chocolate drizzle.",
    isAvailable: true
  },
  {
    id: 11,
    name: "KitKat Shake",
    category: "Beverages",
    price: 149,
    icon: "🥤",
    tag: "New",
    description: "Thick and creamy KitKat shake blended with chocolate, milk, ice cream, and crunchy KitKat pieces.",
    isAvailable: true
  }
];

app.get("/", (req, res) => {
  res.send("Paradise Cafe API is running successfully with MongoDB");
});

app.get("/api/menu", (req, res) => {
  res.status(200).json({
    success: true,
    count: menuItems.length,
    menu: menuItems
  });
});

app.get("/api/menu/all", (req, res) => {
  res.status(200).json({
    success: true,
    count: menuItems.length,
    menu: menuItems
  });
});

app.use("/api/orders", require("./routes/orderRoutes"));

try {
  app.use("/api/feedback", require("./routes/feedbackRoutes"));
} catch (error) {
  console.log("Feedback routes not found, skipping feedback API");
}

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});