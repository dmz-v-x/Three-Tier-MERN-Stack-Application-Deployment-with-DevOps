// backend/models/categoryModel.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
  },
  {
    timestamps: true,
    // Add this to see virtual properties when converting to JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save middleware
categorySchema.pre("save", function (next) {
  console.log("Pre-save category data:", this);
  next();
});

// Post-save middleware
categorySchema.post("save", function (doc) {
  console.log("Category saved successfully:", doc);
});

const Category = mongoose.model("Category", categorySchema);

// Add this to verify model creation
console.log("Category model compiled:", Category.modelName);

module.exports = Category;
