var db = require("../../config/connection");
var collection = require("../../config/collection");
const { ObjectId, Db } = require("mongodb");
const { ObjectID } = require("bson");
const Razorpay = require("razorpay");
var instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEYID,
  key_secret: process.env.RAZORPAY_KEYSECRET,
});

module.exports = {
  getAllCategory: () => {
    return new Promise(async (resolve, reject) => {
      let category = await db
        .get()
        .collection(collection.CATEGORY_COLLECTION)
        .find()
        .toArray();
      resolve(category);
    });
  },
  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      let products = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find()
        .toArray();
      resolve(products);
    });
  },
  cartCount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let count = 0;
      let cart = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: ObjectId(userId) });

      if (cart) {
        count = cart.products.length;
      }
      resolve(count);
    });
  },
  getCategoryDetails: (categoryId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORY_COLLECTION)
        .findOne({ _id: ObjectId(categoryId) })
        .then((category) => {
          resolve(category);
        });
    });
  },
  getProductByCat: (id) => {
    return new Promise(async (resolve, reject) => {
      let category = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find({ category: id })
        .toArray();
      resolve(category);
    });
  },
  // getProductDetails: (productId) => {
  //     return new Promise((resolve, reject) => {
  //         if (ObjectId.isValid(productId)) {
  //             console.log('hioiii');
  //         }else{
  //             console.log('hello');
  //         }
  //         db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: ObjectId(productId) }).then((product) => {
  //             resolve(product)
  //         })
  //     })
  // },
  getProductDetails: (productId) => {
    return new Promise((resolve, reject) => {
      if (ObjectId.isValid(productId)) {
        db.get()
          .collection(collection.PRODUCT_COLLECTION)
          .findOne({ _id: ObjectId(productId) })
          .then((product) => {
            resolve(product);
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        reject(new Error("productId is not a valid ObjectId"));
      }
    });
  },
  addToCart: (prodId, userId) => {
    let proObj = {
      item: ObjectId(prodId),
      quantity: 1,
    };
    return new Promise(async (resolve, reject) => {
      let userCart = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: ObjectId(userId) });

      if (userCart) {
        let proExist = userCart.products.findIndex(
          (product) => product.item == prodId
        );

        if (proExist != -1) {
          db.get()
            .collection(collection.CART_COLLECTION)
            .updateOne(
              {
                user: ObjectId(userId),
                "products.item": ObjectId(prodId),
              },
              {
                $inc: { "products.$.quantity": 1 },
              }
            )
            .then(() => {
              resolve();
            });
        } else {
          db.get()
            .collection(collection.CART_COLLECTION)
            .updateOne(
              { user: ObjectId(userId) },
              {
                $push: { products: proObj },
              }
            )
            .then((response) => {
              resolve();
            });
        }
      } else {
        let cartObj = {
          user: ObjectId(userId),
          products: [proObj],
        };
        db.get()
          .collection(collection.CART_COLLECTION)
          .insertOne(cartObj)
          .then((response) => {
            resolve();
          });
      }
    });
  },
  getUserCartProducts: (userId) => {
    return new Promise(async (resolve, reject) => {
      let cartItem = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: ObjectId(userId) },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "products",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$products", 0] },
            },
          },
        ])
        .toArray();
      resolve(cartItem);
    });
  },
  getTotalAmount: (userId) => {
    return new Promise(async (resolve, reject) => {
      let total = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .aggregate([
          {
            $match: { user: ObjectId(userId) },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "products",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$products", 0] },
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: { $multiply: ["$quantity", "$product.offerPrice"] },
              },
            },
          },
        ])
        .toArray();
      if (total == 0) {
        resolve({ status: true });
      } else {
        resolve(total[0].total);
      }
    });
  },
  changeProductQuantity: (details) => {
    count = parseInt(details.count);
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CART_COLLECTION)
        .updateOne(
          {
            _id: ObjectId(details.cart),
            "products.item": ObjectId(details.product),
          },
          {
            $inc: { "products.$.quantity": count },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },
  deleteCart: (prodId, userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CART_COLLECTION)
        .updateOne(
          {
            user: ObjectId(userId),
          },
          {
            $pull: { products: { item: ObjectId(prodId) } },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },
  getUserDetails: (userId) => {
    return new Promise((resolve, reject) => {
      let user = db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ _id: ObjectID(userId) });
      resolve(user);
    });
  },
  getCartProductList: (userId) => {
    return new Promise((resolve, reject) => {
      let cart = db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: ObjectId(userId) });
      resolve(cart);
    });
  },
  placeOrder: (order, product, wallet) => {
    return new Promise((resolve, reject) => {
      let status = "null";
      if (order.paymentMethod === "cod") {
        status = "placed";
      } else if (order.paymentMethod === "wallet") {
        if (wallet.wallet >= order.total) {
          let total = wallet.wallet - order.total;
          status = "placed";
          db.get()
            .collection(collection.USER_COLLECTION)
            .updateOne(
              { _id: ObjectID(order.userId) },
              { $set: { wallet: total } }
            )
            .then(() => {
              resolve();
            });
        } else {
          order.paymentMethod = "noBal";
        }
      } else if (order.paymentMethod === "online") {
        status = "pending";
      } else {
        order.paymentMethod = null;
      }

      const formattedPrice = order.total
      const numericPrice = parseFloat(formattedPrice.replace(/[^\d.-]/g, ""));
      console.log(numericPrice); // 199.99
      order.total = numericPrice

      let oderObj = {
        deliveryDetails: {
          name: order.name,
          phone: order.phone,
          address: order.address,
          country: order.country,
          state: order.state,
          pincode: order.pincode,
        },
        userId: ObjectId(order.userId),
        paymentMethod: order.paymentMethod,
        products: product.products,
        totalAmount: parseInt(order.total),
        status: status,
        date: new Date(),
        btn: true,
      };
      console.log(oderObj);
      if (oderObj.paymentMethod === "cod") {
        db.get()
          .collection(collection.ORDER_COLLLECTION)
          .insertOne(oderObj)
          .then((response) => {
            db.get()
              .collection(collection.CART_COLLECTION)
              .deleteOne({ user: ObjectId(order.userId) });
            resolve(response);
          });
      } else if (oderObj.paymentMethod === "wallet") {
        db.get()
          .collection(collection.ORDER_COLLLECTION)
          .insertOne(oderObj)
          .then((response) => {
            db.get()
              .collection(collection.CART_COLLECTION)
              .deleteOne({ user: ObjectId(order.userId) });
            resolve(response);
          });
      } else {
        db.get()
          .collection(collection.ORDER_COLLLECTION)
          .insertOne(oderObj)
          .then((response) => {
            resolve(response);
          });
      }
    });
  },
  generateRazorpay: (orderId, total) => {
    return new Promise((resolve, reject) => {
      var options = {
        amount: total * 100,
        currency: "INR",
        receipt: "" + orderId,
      };
      instance.orders.create(options, function (err, order) {
        if (err) {
          console.log(err);
        } else {
          resolve(order);
        }
      });
    });
  },
  verifyPayment: (details, userId) => {
    return new Promise((resolve, reject) => {
      const crypto = require("crypto");
      let hmac = crypto.createHmac("sha256", "uhukdgU5WC3p7HAxDCHwQ69N");
      hmac.update(
        details["payment[razorpay_order_id]"] +
          "|" +
          details["payment[razorpay_payment_id]"]
      );
      hmac = hmac.digest("hex");
      if (hmac == details["payment[razorpay_signature]"]) {
        db.get()
          .collection(collection.CART_COLLECTION)
          .deleteOne({ user: ObjectId(userId) });
        resolve();
      } else {
        reject({ status: false });
      }
    });
  },
  changePaymentStatus: (orderId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ORDER_COLLLECTION)
        .updateOne({ _id: ObjectId(orderId) }, [
          { $set: { status: "placed", btn: true } },
        ])
        .then((response) => {
          resolve({ status: true });
        });
    });
  },
  addToWish: (prodId, userId) => {
    let response = { status: false };
    let proObj = {
      item: ObjectId(prodId),
      quantity: 1,
    };

    return new Promise(async (resolve, reject) => {
      let userWish = await db
        .get()
        .collection(collection.WISH_COLLECTION)
        .findOne({ user: ObjectId(userId) });
      if (userWish) {
        let proExist = userWish.products.findIndex(
          (product) => product.item == prodId
        );

        if (proExist != -1) {
          response.status = true;
          resolve(response);
        } else {
          db.get()
            .collection(collection.WISH_COLLECTION)
            .updateOne(
              { user: ObjectId(userId) },
              {
                $push: { products: proObj },
              }
            )
            .then((response) => {
              resolve();
            });
        }
      } else {
        let cartObj = {
          user: ObjectId(userId),
          products: [proObj],
        };
        db.get()
          .collection(collection.WISH_COLLECTION)
          .insertOne(cartObj)
          .then((response) => {
            resolve(response);
          });
      }
    });
  },
  getUserWishProducts: (userId) => {
    return new Promise(async (resolve, reject) => {
      let wishItem = await db
        .get()
        .collection(collection.WISH_COLLECTION)
        .aggregate([
          {
            $match: { user: ObjectId(userId) },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "products",
            },
          },
          {
            $project: {
              item: 1,
              quantity: 1,
              product: { $arrayElemAt: ["$products", 0] },
            },
          },
        ])
        .toArray();
      resolve(wishItem);
    });
  },
  deleteWish: (prodId, userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.WISH_COLLECTION)
        .updateOne(
          {
            user: ObjectId(userId),
          },
          {
            $pull: { products: { item: ObjectId(prodId) } },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },
  applyCoupon: (coupon) => {
    return new Promise(async (resolve, reject) => {
      let couponDetails = await db
        .get()
        .collection(collection.COUPON_COLLECTION)
        .findOne({
          expiryDate: { $gte: new Date() },
          couponCode: coupon.couponCode,
        });
      if (couponDetails) {
        let total = {};
        let temp = (coupon.total * couponDetails.offerPercentage) / 100;
        if (temp > 2500) {
          temp = 2500;
        }
        total.total = coupon.total - temp;
        total.offer = couponDetails.offerPercentage;
        total.status = true;
        resolve(total);
      } else {
        let total = {};
        total.expire = true;
        resolve(total);
      }
    });
  },
};
