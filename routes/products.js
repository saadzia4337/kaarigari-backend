const express = require("express");
const router = express.Router();
const {
  createProduct,
  listProducts,
  getProduct,
  updateProduct,
} = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, upload.array("images", 5), createProduct);
router.get("/", listProducts);
router.get("/:id", getProduct);
router.put("/:id", authMiddleware, updateProduct);

module.exports = router;
