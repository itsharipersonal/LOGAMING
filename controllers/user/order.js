const orderHelper = require('../../models/user/order')

module.exports = {
    orderList: async (req, res) => {
        let orders = await orderHelper.getUserOrders(req.session.user._id)
        let products = await orderHelper.getOrderProduct(orders._id)
        res.render('user/order-list', { orders, products, usersi: true })
    },
    viewOrder: async (req, res) => {
        try {
            let orders = await orderHelper.getUserOrder(req.params.id)
            let products = await orderHelper.getOrderProduct(req.params.id)
            let cartCount = await orderHelper.cartCount(req.session.user._id)

            function formatCurrencyINR(amount) {
                return new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR'
                }).format(amount);
              }
              const price = orders.totalAmount
              const formattedPrice = formatCurrencyINR(price);
              console.log(formattedPrice); // "₹199.99"   
              orders.totalAmount = formattedPrice

            res.render('user/view-order', { products,orders, usersi: true, cartCount })
        } catch (err) {
            res.render('404')
        }
    }
    ,
    cancelOrder: (req, res) => {
        let orderId = req.params.id
        orderHelper.cancelOrder(orderId).then((order) => {
            res.json(order.status)
        })
    },
    returnOrder: (req, res) => {
        orderHelper.returnOrder(req.params.id).then(() => {
            res.json({ status: true })
        })
    }
}