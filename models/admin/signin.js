var db = require('../../config/connection')
var collection = require('../../config/collection')
var bcrypt = require('bcrypt')

module.exports = {
    doAdminLogin: (userData) => {
        return new Promise(async (resolve, rejects) => {
            let response = {}
            let user = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ username: userData.username })
            if (user != null) {
                bcrypt.compare(userData.password, user.password).then((status) => {

                    if (status) {
                        response.admin = user
                        response.status = true
                        resolve(response)
                    }
                    else {
                        resolve({ status: false })
                    }
                })
            }
            else {
                resolve({ status: false })
            }

        })
    },
    
}
