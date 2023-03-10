var db = require('../../config/connection')
var collection = require('../../config/collection')


module.exports = {
    getTotalAmount: () => {
        return new Promise(async (resolve, rejects) => {
            let totalAmount = {}
            totalAmount.total = await db.get().collection(collection.ORDER_COLLLECTION).aggregate([
                {
                    $match: {
                        status: 'delivered'
                    }
                }, {
                    $group: {
                        _id: null,
                        totalAmount: {
                            $sum: "$totalAmount"
                        }
                    }
                }
            ]).toArray()
            totalAmount.cod = await db.get().collection(collection.ORDER_COLLLECTION).aggregate([
                {
                    $match: {
                        'status': 'delivered',
                        'paymentMethod': 'cod'
                    }
                }, {
                    $group: {
                        _id: null,
                        totalAmount: {
                            $sum: "$totalAmount"
                        }
                    }
                }
            ]).toArray()

            totalAmount.online = await db.get().collection(collection.ORDER_COLLLECTION).aggregate([
                {
                    $match: {
                        'status': 'delivered',
                        'paymentMethod': 'online'
                    }
                }, {
                    $group: {
                        _id: null,
                        totalAmount: {
                            $sum: "$totalAmount"
                        }
                    }
                }
            ]).toArray()
            resolve(totalAmount)
        })


    },
    dashBoard: () => {
        return new Promise(async (resolve, rejects) => {
            let data = {}

            data.deliveredProd = await db.get().collection(collection.ORDER_COLLLECTION).find({ status: 'delivered' }).count()
            data.cancelledProd = await db.get().collection(collection.ORDER_COLLLECTION).find({ status: 'cancelled' }).count()
            data.placedProd = await db.get().collection(collection.ORDER_COLLLECTION).find({ status: 'placed' }).count()
            data.pendingProd = await db.get().collection(collection.ORDER_COLLLECTION).find({ status: 'pending' }).count()
            data.onlineProd = await db.get().collection(collection.ORDER_COLLLECTION).find({ paymentMethod: 'online' }).count()
            data.codProd = await db.get().collection(collection.ORDER_COLLLECTION).find({ paymentMethod: 'cod' }).count()
            resolve(data)
        })
    }
}
