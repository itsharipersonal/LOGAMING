const userHelpers = require("../../models/admin/user");

module.exports = {
  getAllusers: (req, res) => {
    userHelpers.getAllUser().then((user) => {
      res.render("admin/view-user", { admin: true, user });
    });
  },
  blockUser: (req, res) => {
    let userId = req.params.id;
    userHelpers.userBlock(userId).then((user) => {
      res.redirect("/admin/view-user");
    });
  },
};
