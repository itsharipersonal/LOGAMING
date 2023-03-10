
var adminHelper = require('../../models/admin/signin');
var dashBoard = require('../../models/admin/dashboard')
var banner = require('../../models/admin/banner');


module.exports = {
    getAdmin: (req, res) => {
        res.render('admin/index', { adminlogin: true })
    },
    postAdmin: (req, res) => {
        adminHelper.doAdminLogin(req.body).then((response) => {
            if (response.status) {
                req.session.adminLoggedIn = true
                req.session.admin = response.admin
                res.redirect('/admin/admin-land')
            } else {
                res.render('admin/index', { title: 'LogIn', invalid: "Incorrect Username or Password", adminlogin: true })
            }
        })
    },
    adminLand: async (req, res) => {
        if (req.session.adminLoggedIn) {
            let totalAmount = await dashBoard.getTotalAmount()
            let data = await dashBoard.dashBoard()
            res.render('admin/admin-land', { admin: true, totalAmount, data})
        }
    }
}