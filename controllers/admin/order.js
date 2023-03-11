const orderHelpers = require("../../models/admin/order");
const orderHelper = require("../../models/user/order");

module.exports = {
  orderLIst: async (req, res) => {
    let orders = await orderHelpers.getAllOrders();
    res.render("admin/orders", { orders, admin: true });
  },
  getOrderProduct: async (req, res) => {
    let orders = await orderHelper.getUserOrder(req.params.id);
    let products = await orderHelpers.getOrderProduct(req.params.id);
    console.log(orders.totalAmountrs);

    function formatCurrencyINR(amount) {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
    }
    const price = orders.totalAmount;
    const formattedPrice = formatCurrencyINR(price);
    console.log(formattedPrice); // "₹199.99"
    orders.totalAmount = formattedPrice;

    res.render("admin/view-order", { products, admin: true, orders });
  },
  returnOrder: (req, res) => {
    orderHelpers.returnOrderRecieved(req.params.id).then(() => {
      res.json({ status: true });
    });
  },

  getDeliveredReport: async (req, res) => {
    let deliveredReport = await orderHelpers.getDeliveredReport();
    res.render("admin/sales-report", { admin: true, deliveredReport });
  },
  orderShipped: (req, res) => {
    let orderId = req.params.id;
    orderHelpers.orderShipped(orderId).then((order) => {
      res.json(order.status);
    });
  },
  orderDelivered: (req, res) => {
    let orderId = req.params.id;
    orderHelpers.deliveredOrder(orderId).then((order) => {
      res.json(order.status);
    });
  },
};
