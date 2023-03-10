var db = require('../../config/connection')
var collection = require('../../config/collection')
const { ObjectId, Db } = require("mongodb");

module.exports = {
    getImageBanner:()=>{
        return new Promise(async(resolve,reject)=>{
            let banner = {}
            banner.first = await db.get().collection(collection.USER_BANNER_COLLECTION).findOne({bannerPosition:1})
            banner.second = await db.get().collection(collection.USER_BANNER_COLLECTION).findOne({bannerPosition:2})
            banner.third = await db.get().collection(collection.USER_BANNER_COLLECTION).findOne({bannerPosition:3})
            resolve(banner)
        })
    }
}