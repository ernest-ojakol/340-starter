const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildVehicleDetailsGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<section id="vehicle-display">'
    data.forEach(vehicle => { 
        grid+='<div class="vehicle-image">'
        grid +=  '<img src="' + vehicle.inv_image +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model +' on CSE Motors"/></div>'
        grid += '<div class="vehicle-details">'
        grid += '<h2>'+vehicle.inv_make+' Details</h2>'
        grid += '<h2>Price:</h2><p> $' +new Intl.NumberFormat('en-US').format(vehicle.inv_price) +'</p>' 
        grid += '<h2>Description: </h2><p>'+ vehicle.inv_desciption +'</p>' 
        grid += '<h2>Color:</h2><p>'+ vehicle.inv_color +'</p>'
        grid += '<h2>Miles:</h2><p>'+ new Intl.NumberFormat('en-US').format(vehicle.inv_miles) +'</p>'
        grid += '</div>'
    })
    grid += '</section>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/account/login")
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.verifyAccountType=async function (req, res, next){
  //console.log('Cookies:', req.cookies);
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).render("account/login", {
      title: "Login",
      nav: Util.getNav(),
      userIsLoggedIn: false,
      notice: "You must be logged in to access this page.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const accountData = accountModel.getAccountByEmail(decoded.account_email);
    
    if (accountData && (accountData.account_type === 'Employee' || accountData.account_type === 'Admin')) {
      req.user = accountData;
      next();
    } else {
      return res.status(403).render("account/login", {
        title: "Login",
        nav: Util.getNav(),
        userIsLoggedIn: false,
        notice: "You are not authorized to access this page. Please log in as an Employee or Admin.",
      });
    }
  } catch (error) {
    console.error('JWT verification failed:', error);
    return res.status(401).render("account/login", {
      title: "Login",
      nav: Util.getNav(),
      userIsLoggedIn: false,
      notice: "You must be logged in to access this page.",
    });
  }
}


module.exports = Util