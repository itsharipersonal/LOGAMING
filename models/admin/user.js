var db = require("../../config/connection");
var collection = require("../../config/collection");
const { ObjectId, Db } = require("mongodb");

module.exports = {
  getAllUser: () => {
    return new Promise(async (resolve, reject) => {
      let user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .find()
        .toArray();
      resolve(user);
    });
  },
  userBlock: (userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USER_COLLECTION)
        .updateOne({ _id: ObjectId(userId) }, [
          { $set: { status: { $not: "$status" } } },
        ])
        .then((response) => {
          resolve(response);
        });
    });
  },
};
