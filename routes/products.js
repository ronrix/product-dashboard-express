
const express = require("express");
const router = express.Router();

// controller
const ProductController = require("../controllers/ProductController");

// get routes
router.get("/product/new", ProductController.add_product);
router.get("/product/edit/:id", ProductController.edit_product);
router.get("/product/confirmation/:id", ProductController.confirmation);
router.get("/product/delete/:id", ProductController.remove_product);
router.get("/products/show/:id", ProductController.product_show);

// post routes
router.post("/product/process_create", ProductController.process_add_product);
router.post("/product/process_edit", ProductController.process_edit_product);

module.exports = router;