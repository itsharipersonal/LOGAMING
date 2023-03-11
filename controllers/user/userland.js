const productHelper = require('../../models/user/product')
const banner = require('../../models/user/banner')
module.exports = {
  userLand: async (req, res, next) => {
    let category = await productHelper.getAllCategory();
    let products = await productHelper.getAllProducts();
    let bannerImage = await banner.getImageBanner()
    if (req.session.userLoggedIn) {
      let cartCount = await productHelper.cartCount(req.session.user._id)
      res.render("user/index", { usersi: true, category, cartCount, products, bannerImage });
    }
    else {
      res.render("user/index", { usersi: false, category, products, bannerImage });
    }
  }
}