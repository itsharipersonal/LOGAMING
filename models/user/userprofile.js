var db = require('../../config/connection')
var collection = require('../../config/collection')
const { ObjectId, Db } = require("mongodb");
const { ObjectID } = require("bson");
const { response } = require('express');
var bcrypt = require('bcrypt')

module.exports = {
    getUserDetails: (userId) => {
        return new Promise((resolve, reject) => {
            let user = db.get().collection(collection.USER_COLLECTION).findOne({ _id: ObjectID(userId) })
            resolve(user)
        })
    },
    addProfileDetails: (user) => {
        return new Promise((resolve, reject) => {
            address = {
                address: user.address,
                country: user.country,
                state: user.state,
                pincode: user.pincode
            }
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectId(user.userId) }, { $set: { address: [address] } }).then((response) => {
                resolve(response)
            })
        })
    },
    verifyPwd: (userId, userData) => {
        return new Promise(async (resolve, reject) => {
            let response = {};
            let user = await db
                .get()
                .collection(collection.USER_COLLECTION)
                .findOne({ _id: ObjectId(userId) });

            bcrypt.compare(userData.password, user.password).then((status) => {
                if (status) {
                    response.user = user;
                    response.status = true;
                    resolve(response);
                } else {
                    resolve({ status: false });
                }
            });
        })
    },
    changePwd: (pwd, userId) => {
        return new Promise(async (resolve, reject) => {
            pwd = await bcrypt.hash(pwd, 10);
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectId(userId) }, { $set: { password: pwd } }).then((response) => {
                response.status = true
                resolve(response)
            })
        })
    },
    addSecondaryAddress:(address)=>{
        return new Promise((resolve,reject)=>{
            let address1={}
            address1.address = address.address,
            address1.country = address.country,
            address1.state = address.state,
            address1.pincode = address.pincode,
            address1.default = true
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:ObjectID(address.userId)},{$set:{defaultAddress:address1}}).then((response)=>{
                resolve()
            })
        })
    },
    addAditionalAddress:(address)=>{
        return new Promise((resolve,reject)=>{
            let address1={}
            function generateOTP() {
                let OTP = "";
                const characters = "0123456789";
                const charactersLength = characters.length;
                for (let i = 0; i < 6; i++) {
                  OTP += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return OTP;
              }
            address1.id =generateOTP()
            address1.address = address.address,
            address1.country = address.country,
            address1.state = address.state,
            address1.pincode = address.pincode
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:ObjectID(address.userId)},{$push: {address:address1}}).then((response)=>{
                resolve()
            })

        })
    },
    getUserAddress:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).findOne({_id:ObjectID(userId)},{_id:0,address:1}).then((response)=>{
                resolve(response.address)
            });

        })
    },
    makeDefaultAddress:(addressId)=>{
        return new Promise(async(resolve,reject)=>{
           let address =  await db.get().collection(collection.USER_COLLECTION).findOne({"address.id": addressId },{"address.$": 1})
           let matchedAddress = await address.address.filter(address => address.id === addressId);
           db.get().collection(collection.USER_COLLECTION).updateOne({_id:ObjectID(address._id)},{$set:{
            defaultAddress: {
                "address":matchedAddress[0].address,
                "country": matchedAddress[0].country,
                "state":matchedAddress[0].state,
                "pincode":matchedAddress[0].pincode,
                "default": true
                }
           }}).then(()=>{
            resolve()
           })
        })
    },
    deleteAddress:(addressId,userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).updateOne(
                {"_id": ObjectId(userId)},
                { "$pull": { "address": { "id": addressId } } }
             ).then(()=>{
                resolve()
             })
        })
    },
    walletPurchase:(total,id)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).updateOne(
                {'_id':ObjectID(id)},
                {'$set':{'wallet':total}}
            ).then(()=>{
                resolve()
            })
        })
    }
    
}