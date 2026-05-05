const express = require("express");
const router = express.Router();
const {
  createProduct,
  listProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, upload.fields([{ name: 'images', maxCount: 5 }, { name: 'tryOnImage', maxCount: 1 }]), createProduct);
router.get("/", listProducts);
router.get("/:id", getProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;
