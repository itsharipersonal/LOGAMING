var db = require("../../config/connection");
var collection = require("../../config/collection");
const { ObjectId, Db } = require("mongodb");
const { ObjectID } = require("bson");
var bcrypt = require("bcrypt");

module.exports = {
  doLogin: (userData) => {
    return new Promise(async (resolve, rejects) => {
      //let loginStatus = false
      let response = {};
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ email: userData.email });

      if (user != null) {
        bcrypt.compare(userData.password, user.password).then((status) => {
          if (status) {
            response.user = user;
            response.status = true;

            resolve(response);
          } else {
            resolve({ status: false });
          }
        });
      } else {
        resolve({ status: false });
      }
    });
  },
  doSignup: (userData) => {
    return new Promise(async (resolve, rejects) => {
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({
          $or: [{ email: userData.email }, { phone: userData.phone }],
        });

      if (!user) {
        userData.password = await bcrypt.hash(userData.password, 10);
        userData.status = true;
        db.get()
          .collection(collection.USER_COLLECTION)
          .insertOne(userData)
          .then((data) => {
            resolve(data);
          });
      } else {
        resolve(false);
      }
    });
  },
  otpLogin: (userData) => {
    let response = {};
    return new Promise(async (resolve, reject) => {
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({ phone: userData.phone });
      if (user) {
        response.user = user;
        response.status = true;
        resolve(response);
      } else {
        resolve({ status: false });
      }
    });
  },
};
