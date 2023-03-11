var express = require("express");
var router = express.Router();

const signin = require("../controllers/user/signin");
const userLand = require("../controllers/user/userland");
const product = require("../controllers/user/product");
const logout = require("../controllers/user/logout");
const order = require("../controllers/user/order");
const user = require("../controllers/user/userprofile");

//SIGN IN
router.get("/signin", loggedin, signin.userSignin);
//SIGN IN POST
router.post("/signin", loggedin, signin.postUserSignin);
//OTP LOGIN
router.get("/otp-login", loggedin, signin.otpLogin);
//POST OTP LOGIN
router.post("/otp-login", loggedin, signin.postOtpLogin);
//OTP VERIFICATION PAGE
router.get("/otp-verification", loggedin, signin.otpVerification);
//POST OTP VERIFICATION
router.post("/otp-verification", loggedin, signin.postOtpVerifiaction);
//SIGN UP
router.post("/signup", loggedin, signin.postUserSignup);
//LOG OUT
router.get("/logout", logout.logout);
//USER LAND
router.get("/", userLand.userLand);
//PRODUCT LIST
router.get("/product-list/:id", product.productList);
//PRODUCT DETAILS
router.get("/product-details/:id", product.productDetails);
//ADD TO CART
router.get("/add-to-cart/:id", verifyloggedin, product.addToCart);
//VIEW CART
router.get("/view-cart", verifyloggedin, product.viewCart);
//CHANGE PRODUCT QUANTITY
router.post("/change-product-quantity", verifyloggedin, product.changeQuantity);
//DELETE CART PRODUCT
router.get("/delete-cartProduct/:id", verifyloggedin, product.deleteCart);
//COD CHECK OUT
router.get("/cod-check-out", verifyloggedin, product.checkOut);
//PLACE ORDER
router.post("/place-order", verifyloggedin, product.placeOrder);
//VERIFY PAYMENT
router.post("/verify-payment", verifyloggedin, product.verifyPayment);
//ORDER LIST
router.get("/order-list", verifyloggedin, order.orderList);
//VIEW ORDER
router.get("/view-order/:id", verifyloggedin, order.viewOrder);
//CANCEL ORDER
router.get("/cancel-order/:id", verifyloggedin, order.cancelOrder);
//USER PROFILE
router.get("/user-profile", verifyloggedin, user.userProfile);
//POST ADD PROFILE
router.post("/add-profileDetails", verifyloggedin, user.addProfileDetails);
//VERIFY PASSWORD
router.get("/verify-password", verifyloggedin, user.verifyPassword);
//POST VERIFY PASSWORD
router.post("/verify-pwd", verifyloggedin, user.postVerifyPassword);
//CHANGE PASSWORD
router.get("/change-pwd", verifyloggedin, user.changePassword);
//POST CHANGE PASSOWRD
router.post("/change-pwd", verifyloggedin, user.postChangePassword);
//ADD TO WISH
router.get("/add-to-wish/:id", verifyloggedin, product.addToWish);
//VIEW WISH
router.get("/view-wish", verifyloggedin, product.viewWish);
//DELETE WISH
router.delete("/delete-wishProduct/:id", verifyloggedin, product.deleteWish);
//RETURN ORDER
router.get("/return-order/:id", verifyloggedin, order.returnOrder);
//COUPON REDEEM
router.post("/grabCoupon", verifyloggedin, product.redeemCoupon);
//ADD SECOMNDARY ADDRESS
router.post("/addSecondaryAddress", verifyloggedin, user.addSecondaryAddress);
//ADD ADITIONAL ADDRESS
router.post("/addAditionalAddress", verifyloggedin, user.addAditionalAddress);
//MAKE ADDRESS DEFAULT
router.get("/makeAddressDefault/:id", verifyloggedin, user.makeDefaultAddress);
//DELETE ADDRESS
router.delete("/deleteAddress/:id", verifyloggedin, user.deleteAddress);

//AUTH FUNCTION
function loggedin(req, res, next) {
  if (req.session.userLoggedIn) {
    res.redirect("/");
  } else {
    next();
  }
}
function verifyloggedin(req, res, next) {
  if (req.session.userLoggedIn) {
    next();
  } else {
    res.redirect("/signin");
  }
}

module.exports = router;
