var express = require("express");
var router = express.Router();

const signin = require("../controllers/admin/signin");
const logout = require("../controllers/admin/logout");
const product = require("../controllers/admin/product");
const user = require("../controllers/admin/user");
const order = require("../controllers/admin/order");
const coupon = require("../controllers/admin/coupon");
const banner = require("../controllers/admin/banner");

//AUTHENTICATION VERIFYING
function adminloggedin(req, res, next) {
  if (req.session.adminLoggedIn) {
    res.redirect("/admin/admin-land");
  } else {
    next();
  }
}
//AUTHENTICATION VERIFYING
function adminloggedout(req, res, next) {
  if (req.session.adminLoggedIn) {
    next();
  } else {
    res.redirect("/admin");
  }
}

//ADMIN LOGIN PAGE
router.get("/", adminloggedin, signin.getAdmin);
//ADMIN LOGIN VERIFICATION
router.post("/asignin", adminloggedin, signin.postAdmin);
//ADMIN DASHBOARD
router.get("/admin-land", adminloggedout, signin.adminLand);
//ADMIN LOGOUT
router.get("/alogout", adminloggedout, logout.adminLogout);
//PRODUCT LIST
router.get("/products", adminloggedout, product.getProducts);
//PRODUCT LIST
router.get("/product-list/:id", adminloggedout, product.listProduct);
//DELETE PRODUCT
router.delete("/delete-product/:id", adminloggedout, product.deleteProduct);
//ADD PRODUCT
router.get("/add-products", adminloggedout, product.addProduct);
//POST ADD PRODUCT
router.post(
  "/add-products",
  adminloggedout,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  product.postAdminAddProduct
);
//EDIT PRODUCT
router.get("/edit-product/:id", adminloggedout, product.editProduct);
//POST EDIT PRODUCT
router.post(
  "/edit-products/:id",
  adminloggedout,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  product.postAdminEditProduct
);
//CATEGORY
router.get("/add-category", adminloggedout, product.category);
//CATEGORY LIST
router.get("/category", adminloggedout, product.categoryList);
//ADD CATEGORY
router.post(
  "/category",
  adminloggedout,
  upload.fields([{ name: "image1", maxCount: 1 }]),
  product.postAdminAddCat
);
//EDIT CATEGORY
router.get("edit-category/:id", adminloggedout, product.getCatEdit);
//POST EDIT CATEGORY
router.post(
  "/edit-category/:id",
  adminloggedout,
  upload.fields([{ name: "image1", maxCount: 1 }]),
  product.postAdminEditCat
);
//DELETE CATEGORY
router.delete("/delete-category/:id", adminloggedout, product.deleteCat);
//VIEW USER
router.get("/view-user", adminloggedout, user.getAllusers);
//BLOCK USER
router.get("/block-user/:id", adminloggedout, user.blockUser);
//ORDERS
router.get("/orders", adminloggedout, order.orderLIst);
//ORDER DETAILS
router.get("/view-orderAdmin/:id", adminloggedout, order.getOrderProduct);
//ODER RETURN
router.get("/return-order-recieved/:id", adminloggedout, order.returnOrder);
//SHIPPED ORDER
router.get("/shipped-order/:id", adminloggedout, order.orderShipped);
//DELIVERED ORDER
router.get("/delivered-order/:id", adminloggedout, order.orderDelivered);
//SALES REPORT
router.get("/sales-repo", adminloggedout, order.getDeliveredReport);
//COUPON
router.get("/coupon", adminloggedout, coupon.couponList);
//ADD CAT OFFER
router.post("/add-catOffer", adminloggedout, coupon.addcatOffer);
//DELETE CAT OFFER
router.delete("/delete-cat-offer/:id", adminloggedout, coupon.deleteCatOffer);
//ADD PROD OFFER
router.post("/add-prodOffer", adminloggedout, coupon.addProdOffer);
//DELETE PROD OFFER
router.delete("/delete-prod-offer/:id", adminloggedout, coupon.deleteProdOffer);
//ADD COUPON
router.post("/add-coupon", adminloggedout, coupon.addCoupon);
//DELETE COUPON
router.delete("/delete-coupon-offer/:id", adminloggedout, coupon.deleteCoupon);
//BANNER
router.get("/banner", adminloggedout, banner.getBanner);
router.post(
  "/addBannerImage",
  upload.fields([{ name: "image1", maxCount: 1 }]),
  banner.addImage
);
router.post("/setBannerFirst/:id", banner.setBannerFirst);
router.post("/setBannerSecond/:id", banner.setBannerSecond);
router.post("/setBannerThird/:id", banner.setBannerThird);
router.delete("/deleteBanner/:id", banner.deleteBanner);
//DELETE UPLOADING BANNeR
router.delete("/deleteBannerU/:id", banner.deleteBannerU);

module.exports = router;
