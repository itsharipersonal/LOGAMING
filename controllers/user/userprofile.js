const userHelpers = require("../../models/user/userprofile");

module.exports = {
  userProfile: async (req, res) => {
    let user = await userHelpers.getUserDetails(req.session.user._id);
    let address = await userHelpers.getUserAddress(req.session.user._id);
    res.render("user/user-profile", { usersi: true, user, address });
  },
  addProfileDetails: (req, res) => {
    userHelpers.addProfileDetails(req.body).then((response) => {
      res.json(response);
    });
  },
  verifyPassword: (req, res) => {
    res.render("user/verify-password", { usersi: true });
  },
  postVerifyPassword: (req, res) => {
    userHelpers.verifyPwd(req.session.user._id, req.body).then((response) => {
      res.json(response);
    });
  },
  changePassword: (req, res) => {
    res.render("user/change-pwd", { usersi: true });
  },
  postChangePassword: (req, res) => {
    let pwd = req.body;
    if (pwd.password != pwd.cpassword) {
      response.status = false;
      res.json(response);
    } else if (pwd.password == "") {
      response.status = false;
      res.json(response);
    } else {
      userHelpers
        .changePwd(pwd.password, req.session.user._id)
        .then((response) => {
          res.json(response);
        });
    }
  },
  addSecondaryAddress: (req, res) => {
    userHelpers.addSecondaryAddress(req.body).then(() => {
      res.json({ status: true });
    });
  },
  addAditionalAddress: (req, res) => {
    userHelpers.addAditionalAddress(req.body).then(() => {
      res.json({ status: true });
    });
  },
  makeDefaultAddress: (req, res) => {
    userHelpers.makeDefaultAddress(req.params.id).then(() => {
      res.json({ status: true });
    });
  },
  deleteAddress: (req, res) => {
    userHelpers.deleteAddress(req.params.id, req.session.user._id).then(() => {
      res.json({ status: true });
    });
  },
};
