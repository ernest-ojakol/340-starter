const utilities = require("../utilities/")
const baseController = {}
const jwt = require('jsonwebtoken');

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  const jwtCookie = req.cookies.jwt;
  if(jwtCookie){
    const verified = jwt.verify(jwtCookie, process.env.ACCESS_TOKEN_SECRET);
    console.log("Verified user data:", verified);
    const { account_type: accountType, ...user } = verified;
    userIsLoggedIn=true;
    res.render("index", {title: "Home", nav, userIsLoggedIn,user,accountType,})
  }else {
      const accountType="";
      const user="";
      // No JWT cookie, redirect to login
      userIsLoggedIn=false;
      console.log("No JWT cookie present");
      res.render("index", {title: "Home", nav, userIsLoggedIn,user,accountType,})
  }
}

module.exports = baseController