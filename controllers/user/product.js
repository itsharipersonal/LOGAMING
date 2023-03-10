const productHelper = require('../../models/user/product')
const userHelper = require('../../models/user/userprofile')
const orderhelper = require('../../models/user/order')

module.exports = {
  productList: async (req, res) => {
    let category = await productHelper.getCategoryDetails(req.params.id);
    productHelper.getProductByCat(req.params.id).then(async (products) => {
      if (req.session.userLoggedIn) {
        let cartCount = await productHelper.cartCount(req.session.user._id)
        res.render("user/product-list", { usersi: true, products, category, cartCount });
      } else {
        res.render("user/product-list", { usersi: false, products, category });
      }
    });
  },
  productDetails: async (req, res,next) => {
    try {
      let product = await productHelper.getProductDetails(req.params.id);
      if (req.session.userLoggedIn) {
        let cartCount = await productHelper.cartCount(req.session.user._id)
        res.render("user/product-details", { usersi: true, product, cartCount });
      } else {
        res.render("user/product-details", { product });
      }
    } catch (err) {
      console.error(err);
      res.status(404).render('404')
    }
  }
  
  ,
  addToCart: (req, res) => {
    productHelper.addToCart(req.params.id, req.session.user._id).then(() => {
      res.json({ status: true })
    })
  },
  viewCart: async (req, res) => {
    if (req.session.userLoggedIn) {
      let cart = await productHelper.getUserCartProducts(req.session.user._id)
      let total = await productHelper.getTotalAmount(req.session.user._id)
      let user = req.session.user._id
      if (total.status) {
        res.render('user/view-cart', { usersi: true, cart, user, value: true })
      }
      else {
        res.render('user/view-cart', { usersi: true, cart, user, total })
      }
    }
  },
  changeQuantity: (req, res) => {
    productHelper.changeProductQuantity(req.body).then(async (response) => {
      let user = req.session.user._id
      let total = await productHelper.getTotalAmount(user)
      if (total) {
        response.total = total
        res.json(response)
      } else {
        res.json(response)
      }
    })
  },
  deleteCart: (req, res) => {
    productHelper.deleteCart(req.params.id, req.session.user._id).then((response) => {
      res.json(response)
    })
  },
  checkOut: async (req, res) => {
    let total = await productHelper.getTotalAmount(req.session.user._id)
    let cartCount = await productHelper.getTotalAmount(req.session.user._id)
    let user = await productHelper.getUserDetails(req.session.user._id)
    let address = await userHelper.getUserAddress(req.session.user._id)
    if (cartCount.status) {
      res.redirect('/')
    } else {
      res.render('user/cod-check-out', { usersi: true, user, total,address})
    }
  },
  placeOrder: async (req, res) => {
    let products = await productHelper.getCartProductList(req.body.userId)
    let wallet = await userHelper.getUserDetails(req.body.userId)
    productHelper.placeOrder(req.body,products,wallet).then((response) => {
      if (req.body['paymentMethod'] == 'cod') {
        res.json({ cod: true })
      }
      else if (req.body['paymentMethod'] == 'online') {
        console.log('wfgegh');
        productHelper.generateRazorpay(response.insertedId, req.body.total).then((response) => {
          res.json({ response })
        })
      }
      else if(req.body['paymentMethod'] == 'noBal'){
        orderhelper.deleteOrder().then(()=>{
          res.json({noBal:true})
        })
      }
      else if(req.body['paymentMethod'] == 'wallet'){
        res.json({ cod: true })
      }
      else {
        res.json({ error: true })
      }
    })
  },
  verifyPayment: async (req, res) => {
    let userId = req.session.user._id
    productHelper.verifyPayment(req.body, userId).then(() => {
      productHelper.changePaymentStatus(req.body['order[receipt]']).then(() => {
        res.json({ status: true })
      })
    }).catch((err) => {
      console.log(err);
      res.json({ status: false, errMsg: '' })
    })
  },
  addToWish: (req, res) => {
    productHelper.addToWish(req.params.id, req.session.user._id).then((response) => {
      res.json({ status: true })
    })
  },
  viewWish: async (req, res) => {
    if (req.session.userLoggedIn) {
      let wish = await productHelper.getUserWishProducts(req.session.user._id)
      let user = req.session.user._id
      res.render('user/view-wish', { usersi: true, wish, user })
    }
  },
  deleteWish: (req, res) => {
    productHelper.deleteWish(req.params.id, req.session.user._id).then((response) => {
      res.json(response)
    })
  },
  redeemCoupon: (req, res) => {
    productHelper.applyCoupon(req.body).then(async (response) => {
      let total = await productHelper.getTotalAmount(req.session.user._id)
      let user = await productHelper.getUserDetails(req.session.user._id)
      res.render('user/cod-check-out', { total, user, response, usersi: true })
    })
  }
}