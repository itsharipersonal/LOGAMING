var db = require('../../config/connection')
var collection = require('../../config/collection')
const { ObjectId, Db } = require("mongodb");
const { ObjectID } = require("bson");


module.exports = {
    getAllOrders: () => {
        return new Promise(async (resolve, reject) => {
            let orders = await db.get().collection(collection.ORDER_COLLLECTION).find().sort({ date: -1 }).toArray()
            resolve(orders)
        })
    },
    getOrderProduct: (orderId) => {
        return new Promise(async (resolve, reject) => {
            let cartItem = await db
                .get()
                .collection(collection.ORDER_COLLLECTION)
                .aggregate([
                    {
                        $match: { _id: ObjectId(orderId) },
                    },
                    {
                        $unwind: '$products'
                    },
                    {
                        $project:
                        {
                            item: '$products.item',
                            quantity: '$products.quantity'
                        }
                    },
                    {
                        $lookup: {
                            from: collection.PRODUCT_COLLECTION,
                            localField: 'item',
                            foreignField: '_id',
                            as: 'products'
                        }
                    },
                    {
                        $project: {
                            item: 1, quantity: 1, product: { $arrayElemAt: ['$products', 0] }
                        }
                    }

                ])
                .toArray();
            resolve(cartItem);
        });
    },
    returnOrderRecieved: (orderId) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.ORDER_COLLLECTION).updateOne({ _id: ObjectID(orderId) }, { $set: { status: 'Product Arrieved To Seller', return: false, productReturning: false } })

            let wallet = await db.get().collection(collection.ORDER_COLLLECTION).findOne({ _id: ObjectID(orderId) })
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: ObjectID(wallet.userId) })
            if (user.wallet) {
                user.wallet = user.wallet + wallet.totalAmount
                await db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectID(wallet.userId) }, { $set: { wallet: parseInt(user.wallet), walletUpdate: new Date } }).then(() => {
                    resolve()
                })
            }
            else {
                await db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectID(wallet.userId) }, { $set: { wallet: parseInt(wallet.totalAmount), walletUpdate: new Date } }).then(() => {
                    resolve()
                })
            }

        })
    },
    getDeliveredReport: () => {
        return new Promise(async (resolve, rejects) => {
            let report = await db.get().collection(collection.ORDER_COLLLECTION).find({ status: "delivered" }).toArray()
            resolve(report)
        })
    },
    orderShipped: (orderId) => {
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collection.ORDER_COLLLECTION)
                .updateOne({ _id: ObjectId(orderId) }, [
                    { $set: { status: 'shipped', } },
                ])
                .then((response) => {

                    resolve({ status: true });
                });
        });
    },
    deliveredOrder: (orderId) => {
        return new Promise((resolve, reject) => {
            db.get()
                .collection(collection.ORDER_COLLLECTION)
                .updateOne({ _id: ObjectId(orderId) }, [
                    { $set: { status: 'delivered', btn: false, return: true } },
                ])
                .then((response) => {
                    resolve({ status: true });
                });
        });
    },

}