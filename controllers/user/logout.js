module.exports = {
    logout:(req, res) => {
        req.session.userLoggedIn = false;
        res.redirect('/')
      }
}