var db = require("../../config/connection");
var collection = require("../../config/collection");
const { ObjectId, Db } = require("mongodb");

module.exports = {
  addImage: (name, imageurl) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.BANNER_COLLECTION)
        .insertOne({ bannerName: name.banner, bannerImage: imageurl })
        .then((response) => {
          resolve(response);
        });
    });
  },
  getImageBanner: () => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.BANNER_COLLECTION)
        .find({})
        .toArray()
        .then((response) => {
          resolve(response);
        });
    });
  },
  setBannerFirst: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        let bannerImage = await db
          .get()
          .collection(collection.BANNER_COLLECTION)
          .findOne({ _id: ObjectId(id) });
        let banner = await db
          .get()
          .collection(collection.USER_BANNER_COLLECTION)
          .findOne({});
        if (!banner) {
          console.log("hiii am here");
          db.get()
            .collection(collection.USER_BANNER_COLLECTION)
            .insertOne({
              bannerImage: bannerImage.bannerImage[0],
              bannerName: bannerImage.bannerName,
              bannerPosition: 1,
              id: id,
            })
            .then(() => {
              db.get()
                .collection(collection.BANNER_COLLECTION)
                .updateMany({}, { $set: { first: true } })
                .then(() => {
                  resolve();
                });
            });
        }
      } catch {
        reject(new Error("SOMETHING WENT WRONG ON BANNER"));
      }
    });
  },
  setBannerSecond: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        let bannerImage = await db
          .get()
          .collection(collection.BANNER_COLLECTION)
          .findOne({ _id: ObjectId(id) });
        let banner = await db
          .get()
          .collection(collection.USER_BANNER_COLLECTION)
          .findOne({ bannerPosition: { $ne: 1 } });
        if (!banner || banner.bannerPosition == 3) {
          console.log("hiii am here");
          db.get()
            .collection(collection.USER_BANNER_COLLECTION)
            .insertOne({
              bannerImage: bannerImage.bannerImage[0],
              bannerName: bannerImage.bannerName,
              bannerPosition: 2,
              id: id,
            })
            .then(() => {
              db.get()
                .collection(collection.BANNER_COLLECTION)
                .updateMany({}, { $set: { second: true } })
                .then(() => {
                  resolve();
                });
            });
        }
      } catch {
        reject(new Error("SOMETHING WENT WRONG ON BANNER"));
      }
    });
  },
  setBannerThird: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        let bannerImage = await db
          .get()
          .collection(collection.BANNER_COLLECTION)
          .findOne({ _id: ObjectId(id) });
        let banner = await db
          .get()
          .collection(collection.USER_BANNER_COLLECTION)
          .findOne({ bannerPosition: { $nin: [1, 2] } });
        if (!banner) {
          console.log("hiii am here");
          db.get()
            .collection(collection.USER_BANNER_COLLECTION)
            .insertOne({
              bannerImage: bannerImage.bannerImage[0],
              bannerName: bannerImage.bannerName,
              bannerPosition: 3,
              id: id,
            })
            .then(() => {
              db.get()
                .collection(collection.BANNER_COLLECTION)
                .updateMany({}, { $set: { third: true } })
                .then(() => {
                  resolve();
                });
            });
        }
      } catch {
        reject(new Error("SOMETHING WENT WRONG ON BANNER"));
      }
    });
  },
  userBanner: () => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.USER_BANNER_COLLECTION)
          .find()
          .toArray()
          .then((response) => {
            resolve(response);
          });
      } catch {
        reject(new Error("SOMETHING WENT WRONG ON BANNER"));
      }
    });
  },
  deleteBanner: (id) => {
    return new Promise(async (resolve, reject) => {
      let banner = await db
        .get()
        .collection(collection.USER_BANNER_COLLECTION)
        .findOne({ _id: ObjectId(id) });
      if (banner.bannerPosition == 1) {
        db.get()
          .collection(collection.BANNER_COLLECTION)
          .updateMany({}, { $set: { first: false } })
          .then(() => {
            db.get()
              .collection(collection.USER_BANNER_COLLECTION)
              .deleteOne({ _id: ObjectId(id) })
              .then(() => {
                resolve();
              });
          });
      } else if (banner.bannerPosition == 2) {
        db.get()
          .collection(collection.BANNER_COLLECTION)
          .updateMany({}, { $set: { second: false } })
          .then(() => {
            db.get()
              .collection(collection.USER_BANNER_COLLECTION)
              .deleteOne({ _id: ObjectId(id) })
              .then(() => {
                resolve();
              });
          });
      } else if (banner.bannerPosition == 3) {
        db.get()
          .collection(collection.BANNER_COLLECTION)
          .updateMany({}, { $set: { third: false } })
          .then(() => {
            db.get()
              .collection(collection.USER_BANNER_COLLECTION)
              .deleteOne({ _id: ObjectId(id) })
              .then(() => {
                resolve();
              });
          });
      }
    });
  },
  deleteBannerU: (id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.BANNER_COLLECTION)
        .deleteOne({ _id: ObjectId(id) })
        .then(() => {
          resolve();
        });
    });
  },
};
