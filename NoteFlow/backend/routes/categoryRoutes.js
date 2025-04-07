// backend/routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const Category = require("../models/categoryModel");
const Note = require("../models/noteModel");

// Get all categories
router.get("/", protect, async (req, res) => {
  try {
    console.log("User requesting categories:", req.user.id);

    // Get categories from notes
    const noteCategories = await Note.distinct("category", {
      user: req.user.id,
    });

    // Get categories from categories collection
    const savedCategories = await Category.find({
      user: req.user.id,
    }).select("name -_id");

    // Combine and remove duplicates
    const allCategories = [
      ...new Set([
        ...noteCategories,
        ...savedCategories.map((cat) => cat.name),
      ]),
    ]
      .filter((category) => category && category !== "uncategorized")
      .sort();

    console.log("Retrieved categories:", allCategories);
    res.json(allCategories);
  } catch (error) {
    console.error("Error in GET /categories:", error);
    res.status(500).json({
      message: "Error fetching categories",
      error: error.message,
    });
  }
});

// Create category
router.post("/", protect, async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("User:", req.user);

    const { name } = req.body;
    if (!name) {
      console.log("Category name missing");
      return res.status(400).json({ message: "Category name is required" });
    }

    const normalizedName = name.trim().toLowerCase();
    console.log("Normalized category name:", normalizedName);

    // Check for existing category
    const existingCategory = await Category.findOne({
      user: req.user.id,
      name: normalizedName,
    });

    if (existingCategory) {
      console.log("Category already exists:", existingCategory);
      return res.status(400).json({ message: "Category already exists" });
    }

    // Create new category
    const categoryData = {
      name: normalizedName,
      user: req.user.id,
    };
    console.log("Creating category with data:", categoryData);

    const category = new Category(categoryData);
    const savedCategory = await category.save();
    console.log("Saved category:", savedCategory);

    res.status(201).json({ name: savedCategory.name });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({
      message: "Error creating category",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Delete category
router.delete("/:name", protect, async (req, res) => {
  try {
    const { name } = req.params;

    await Category.deleteOne({
      user: req.user.id,
      name: name.toLowerCase(),
    });

    await Note.updateMany(
      { user: req.user.id, category: name },
      { $set: { category: "uncategorized" } }
    );

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /categories:", error);
    res.status(500).json({
      message: "Error deleting category",
      error: error.message,
    });
  }
});

module.exports = router;
