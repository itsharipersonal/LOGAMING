var db = require('../../config/connection')
var collection = require('../../config/collection')
const { ObjectId, Db } = require("mongodb");
const { ObjectID } = require("bson");


module.exports = {
    getAllCategory: () => {
        return new Promise(async (resolve, reject) => {
            let category = await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            resolve(category)
        })
    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },
    listCoupon: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.COUPON_COLLECTION).find().toArray().then((response) => {
                resolve(response)
            })
        })
    },
    addcatOffer: (cat) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.CATEGORY_COLLECTION).updateOne({ _id: ObjectId(cat.category) }, { $set: { categoryOffer: parseInt(cat.offerPercentage) } })
            await db.get().collection(collection.PRODUCT_COLLECTION).updateMany({ category: cat.category }, { $set: { categoryOffer: parseInt(cat.offerPercentage) } })

            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find({ category: cat.category }).toArray()
            for (let i = 0; i < products.length; i++) {

                if (products[i].categoryOffer >= products[i].productOffer) {
                    let temp = (products[i].price * products[i].categoryOffer) / 100
                    let offerPrice = products[i].price - temp
                    let updateProduct = await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(products[i]._id) }, { $set: { offerPrice: offerPrice } })
                    await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(products[i]._id) }, { $set: { offer: products[i].categoryOffer } })
                    resolve()
                }
                else if (products[i].categoryOffer < products[i].productOffer) {
                    let temp = (products[i].price * products[i].productOffer) / 100
                    let offerPrice = products[i].price - temp
                    let updateProduct = await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(products[i]._id) }, { $set: { offerPrice: offerPrice } })
                    await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(products[i]._id) }, { $set: { offer: products[i].productOffer } })
                    resolve()
                }
            }


        })
    },
    deleteCatOffer: (catId) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.CATEGORY_COLLECTION).updateMany({ _id: ObjectId(catId) }, { $set: { categoryOffer: parseInt(0) } })
            await db.get().collection(collection.PRODUCT_COLLECTION).updateMany({ category: catId }, { $set: { categoryOffer: parseInt(0) } })
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find({ category: catId }).toArray()

            for (let i = 0; i < products.length; i++) {

                if (products[i].categoryOffer == 0 && products[i].productOffer == 0) {

                    let updateProduct = await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(products[i]._id) }, { $set: { offerPrice: products[i].price } })
                    await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(products[i]._id) }, { $set: { offer: parseInt(0) } })
                    resolve()
                }
                else if (products[i].categoryOffer < products[i].productOffer) {
                    let temp = (products[i].price * products[i].productOffer) / 100
                    let offerPrice = products[i].price - temp
                    let updateProduct = await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(products[i]._id) }, { $set: { offerPrice: offerPrice } })
                    await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(products[i]._id) }, { $set: { offer: products[i].productOffer } })
                    resolve()
                }
            }

        })

    },
    addProdOffer: (prod) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(prod.product) }, { $set: { productOffer: parseInt(prod.offerPercentage) } })

            let product = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: ObjectId(prod.product) })
            if (product.productOffer >= product.categoryOffer) {
                let temp = (product.price * product.productOffer) / 100
                let offerPrice = product.price - temp
                let updateProd = await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(prod.product) }, { $set: { offerPrice: parseInt(offerPrice) } })
                await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(prod.product) }, { $set: { offer: parseInt(prod.offerPercentage) } })
                resolve(updateProd)
            }
            else if (product.productOffer < product.categoryOffer) {
                let temp = (product.price * product.categoryOffer) / 100
                let offerPrice = product.price - temp
                let updateProd = await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(prod.product) }, { $set: { offerPrice: parseInt(offerPrice) } })
                await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(prod.product) }, { $set: { offer: parseInt(product.categoryOffer) } })
                resolve(updateProd)
            }
        })
    },
    deleteOffer: (prodId) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(prodId) }, { $set: { productOffer: parseInt(0) } })
            let product = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: ObjectId(prodId) })
            if (product.productOffer == 0 && product.categoryOffer == 0) {
                await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(prodId) }, {
                    $set: {
                        offerPrice: product.price,
                        offer: parseInt(0)
                    }
                })
                resolve()
            }
            else if (product.productOffer < product.categoryOffer) {
                let temp = (product.price * product.categoryOffer) / 100
                let offerPrice = product.price - temp
                let updateProd = await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(product._id) }, { $set: { offerPrice: parseInt(offerPrice) } })
                await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(product._id) }, { $set: { offer: parseInt(product.categoryOffer) } })
                resolve(updateProd)
            }
        })
    },
    addCoupon: (coupon) => {
        return new Promise((resolve, reject) => {
            coupon.expiryDate = new Date(coupon.expiryDate)
            coupon.offerPercentage = parseInt(coupon.offerPercentage)
            db.get().collection(collection.COUPON_COLLECTION).insertOne(coupon).then(() => {
                resolve()
            })
        })
    },
    deleteCoupon:(couponId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.COUPON_COLLECTION).deleteOne({_id:ObjectId(couponId)}).then(()=>{
                resolve()
            })
        })
    }
}