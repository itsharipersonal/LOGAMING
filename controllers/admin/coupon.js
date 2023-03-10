const couponHelper = require('../../models/admin/coupon')

module.exports = {
    couponList: async (req, res) => {
        let category = await couponHelper.getAllCategory()
        let product = await couponHelper.getAllProducts()
        let coupon = await couponHelper.listCoupon()
        res.render('admin/coupon', { category, product, coupon, admin: true })
    },
    addcatOffer: (req, res) => {
        couponHelper.addcatOffer(req.body).then(() => {
            res.redirect('/admin/coupon')
        })
    },
    deleteCatOffer: (req, res) => {
        couponHelper.deleteCatOffer(req.params.id).then(() => {
            res.json({ status: true })
        })
    },
    addProdOffer: (req, res) => {
        couponHelper.addProdOffer(req.body).then(() => {
            res.redirect('/admin/coupon')
        })
    },
    deleteProdOffer: (req, res) => {
        couponHelper.deleteOffer(req.params.id).then(() => {
            res.json({ status: true })
        })
    },
    addCoupon: (req, res) => {
        couponHelper.addCoupon(req.body).then(() => {
            res.redirect('/admin/coupon')
        })
    },
    deleteCoupon: (req, res) => {
        couponHelper.deleteCoupon(req.params.id).then(() => {
            res.json({ status: true })
        })
    }

}