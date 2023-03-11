
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
            console.log(totalAmount);
            function formatCurrencyINR(amount) {
                return new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR'
                }).format(amount);
              }
              const total = totalAmount.total[0].totalAmount
              const cod = totalAmount.cod[0].totalAmount
              const online = totalAmount.online[0].totalAmount
              
              const total1 = formatCurrencyINR(total);
              const cod1 = formatCurrencyINR(cod);
              const online1 = formatCurrencyINR(online);

              totalAmount.total[0].totalAmount = total1
              totalAmount.cod[0].totalAmount = cod1
              totalAmount.online[0].totalAmount = online1
            res.render('admin/admin-land', { admin: true, totalAmount, data})
        }
    }
}