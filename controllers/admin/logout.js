

module.exports = {
    adminLogout:(req,res)=>{
        req.session.adminLoggedIn=false
        res.render('admin/index', { title: "Logout", logout : "logout Successfull" , adminlogin:true})
      }
}









