const express = require("express");
const Menu = require("../models/Menu");

const router = express.Router();

const defaultMenuItems = [
  {
    name: "Hawaiian Pineapple Pizza",
    category: "Pizza",
    price: 299,
    icon: "🍕",
    tag: "Chef Special",
    description:
      "Sweet pineapple chunks paired with savory cheese and rich tomato sauce.",
    isAvailable: true
  },
  {
    name: "Margherita Pizza",
    category: "Pizza",
    price: 249,
    icon: "🍕",
    tag: "Classic",
    description:
      "Fresh mozzarella, basil, tomato sauce, and crispy golden crust.",
    isAvailable: true
  },
  {
    name: "Veggie Supreme Pizza",
    category: "Pizza",
    price: 279,
    icon: "🍕",
    tag: "Popular",
    description:
      "Loaded with capsicum, onion, olives, corn, tomato, and extra cheese.",
    isAvailable: true
  },
  {
    name: "Cold Coffee",
    category: "Beverages",
    price: 99,
    icon: "☕",
    tag: "Chilled",
    description:
      "Creamy cold coffee blended with chocolate syrup and ice cream.",
    isAvailable: true
  },
  {
    name: "Cappuccino",
    category: "Beverages",
    price: 129,
    icon: "🍵",
    tag: "Hot",
    description:
      "Rich espresso topped with steamed milk foam and cocoa dust.",
    isAvailable: true
  },
  {
    name: "Cheese Burger",
    category: "Fast Food",
    price: 159,
    icon: "🍔",
    tag: "Crispy",
    description:
      "Soft bun stuffed with cheese patty, lettuce, onion, and house sauce.",
    isAvailable: true
  },
  {
    name: "French Fries",
    category: "Snacks",
    price: 89,
    icon: "🍟",
    tag: "Crunchy",
    description:
      "Golden crispy potato fries served with spicy tomato dip.",
    isAvailable: true
  },
  {
    name: "Veg Sandwich",
    category: "Snacks",
    price: 119,
    icon: "🥪",
    tag: "Fresh",
    description:
      "Grilled sandwich with fresh vegetables, cheese, and mint chutney.",
    isAvailable: true
  },
  {
    name: "Chocolate Cake",
    category: "Dessert",
    price: 139,
    icon: "🍰",
    tag: "Sweet",
    description:
      "Soft chocolate sponge layered with creamy chocolate frosting.",
    isAvailable: true
  },
  {
    name: "Vanilla Ice Cream",
    category: "Dessert",
    price: 79,
    icon: "🍨",
    tag: "Cool",
    description:
      "Classic vanilla ice cream scoop with chocolate drizzle.",
    isAvailable: true
  },
  {
    name: "KitKat Shake",
    category: "Beverages",
    price: 149,
    icon: "🥤",
    tag: "New",
    description:
      "Thick and creamy KitKat shake blended with chocolate, milk, ice cream, and crunchy KitKat pieces.",
    isAvailable: true
  }
];

const seedDefaultMenu = async () => {
  const count = await Menu.countDocuments();

  if (count === 0) {
    await Menu.insertMany(defaultMenuItems);
  }
};

router.get("/", async (req, res) => {
  try {
    await seedDefaultMenu();

    const menu = await Menu.find({ isAvailable: true }).sort({
      createdAt: -1
    });

    return res.status(200).json({
      success: true,
      count: menu.length,
      menu
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    await seedDefaultMenu();

    const menu = await Menu.find().sort({
      createdAt: -1
    });

    return res.status(200).json({
      success: true,
      count: menu.length,
      menu
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, category, price, icon, tag, description, isAvailable } =
      req.body;

    if (!name || !category || !price || !description) {
      return res.status(400).json({
        success: false,
        message: "Name, category, price and description are required"
      });
    }

    const menuItem = await Menu.create({
      name,
      category,
      price,
      icon: icon || "🍽️",
      tag: tag || "Special",
      description,
      isAvailable:
        typeof isAvailable === "boolean" ? isAvailable : true
    });

    return res.status(201).json({
      success: true,
      message: "Menu item added successfully",
      menuItem
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const menuItem = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      menuItem
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
    const menuItem = await Menu.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found"
      });
    }

    await menuItem.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Menu item deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;