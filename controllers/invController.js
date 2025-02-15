const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const jwt = require('jsonwebtoken');

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  console.log("data "+JSON.stringify(data))
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  let userIsLoggedIn;
  const jwtCookie = req.cookies.jwt;
  console.log("data "+JSON.stringify(data))
  console.log("Class Name "+data[0].classification_name)
  //const className
  if(jwtCookie){
    const verified = jwt.verify(jwtCookie, process.env.ACCESS_TOKEN_SECRET);
    console.log("Verified user data:", verified);
    const { account_type: accountType, ...user } = verified;
    userIsLoggedIn=true;
    if(data && data.length > 0){
      var className = data[0].classification_name
    }else{
      var className="dope javascript"
    }
    
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      user,
      accountType,
      userIsLoggedIn,
    })
  }else {
      // No JWT cookie, redirect to login
      if(data && data.length > 0){
      var className = data[0].classification_name
      }else{
        var className="dope javascript"
      }
      userIsLoggedIn=false;
      console.log("No JWT cookie present");
      const user="";
      const accountType="";
      //res.redirect(`/account/login?returnUrl=/inv/type/${classification_id}`);
      res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
        user,
        accountType,
        userIsLoggedIn,
      })
  }
}

invCont.buildByInv_Id = async function(req,res,next) {
    const inv_id = req.params.inv_id
    console.log("inv id ="+ inv_id)
    const data = await invModel.getVehicleDetails(inv_id)
    console.log("Data ="+ data)
    const grid = await utilities.buildVehicleDetailsGrid(data)
    let nav = await utilities.getNav()
    const make = data[0].inv_make
    const year = data[0].inv_year
    const model = data[0].inv_model
    const jwtCookie = req.cookies.jwt;
    if(jwtCookie){
      const verified = jwt.verify(jwtCookie, process.env.ACCESS_TOKEN_SECRET);
      console.log("Verified user data:", verified);
      const { account_type: accountType, ...user } = verified;
      userIsLoggedIn=true;
      res.render("./inventory/vehicle_details", {
        title:year+" " + make + " " +model,
        nav,
        grid,
        userIsLoggedIn,
        user,
        accountType,
      })
    }else {
        // No JWT cookie, redirect to login
        userIsLoggedIn=false;
        const user="";
        const accountType="";
        console.log("No JWT cookie present");
        //res.redirect("/account/account/login");
        res.render("./inventory/vehicle_details", {
          title:year+" " + make + " " +model,
          nav,
          grid,
          userIsLoggedIn,
          user,
          accountType,
        })
    }
}

invCont.buildManagementInv = async function(req, res, next) {
  let nav = await utilities.getNav()
  const notice = req.flash("notice")[0];
  const select = await utilities.buildClassificationList()

  const jwtCookie = req.cookies.jwt;

  let userIsLoggedIn;

  if(jwtCookie){
    const verified = jwt.verify(jwtCookie, process.env.ACCESS_TOKEN_SECRET);
    console.log("Verified user data:", verified);
    const { account_type: accountType, ...user } = verified;
    userIsLoggedIn=true;
    res.render("./inventory/management", {
        nav,
        notice,
        select,
        user,
        accountType,
        userIsLoggedIn,
    });
  }else {
      // No JWT cookie, redirect to login
      console.log("No JWT cookie present");
      res.redirect("/account/account/login");
  }
  
};

invCont.buildAddInventoryView = async function(req, res, next) {
  let nav = await utilities.getNav()
  const select=await utilities.buildClassificationList()
  const jwtCookie = req.cookies.jwt;

  let userIsLoggedIn;

  if(jwtCookie){
    const verified = jwt.verify(jwtCookie, process.env.ACCESS_TOKEN_SECRET);
    console.log("Verified user data:", verified);
    const { account_type: accountType, ...user } = verified;
    userIsLoggedIn=true;
    res.render("./inventory/addinventory", {
      messages:"Successfully Added/Failed to Add",
      nav,
      select,
      user,
      accountType,
      userIsLoggedIn,
    });
  }else {
      // No JWT cookie, redirect to login
      console.log("No JWT cookie present");
      res.redirect("/account/account/login");
  }
};

invCont.buildAddClassificationView = async function(req, res, next) {
  let nav = await utilities.getNav()
  const jwtCookie = req.cookies.jwt;

  let userIsLoggedIn;

  if(jwtCookie){
    const verified = jwt.verify(jwtCookie, process.env.ACCESS_TOKEN_SECRET);
    console.log("Verified user data:", verified);
    const { account_type: accountType, ...user } = verified;
    userIsLoggedIn=true;
    res.render("./inventory/addclassification", {
      messages:"Successfully Added/Failed to Add",
      nav,
      user,
      accountType,
      userIsLoggedIn,
    });
  }else {
      // No JWT cookie, redirect to login
      console.log("No JWT cookie present");
      res.redirect("/account/account/login");
  }
};

invCont.processAddedClassification=async function(req, res) {
  let nav = await utilities.getNav()
  const { classification_name} = req.body
  const jwtCookie = req.cookies.jwt;
  const verified = jwt.verify(jwtCookie, process.env.ACCESS_TOKEN_SECRET);
  console.log("Verified user data:", verified);
  const { account_type: accountType, ...user } = verified;
  const userIsLoggedIn=true;

  console.log(JSON.stringify(req.body))

  const regResult = await invModel.addClassification(
    classification_name
  )
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve registered ${classification_name}.`
    )
    res.status(201).render("./inventory/management", {
      title: "Inventory",
      nav,
      notice: req.flash("notice")[0],
      accountType,
      user,
      userIsLoggedIn,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("./inventory/management", {
      title: "Inventory",
      nav,
      notice: req.flash("notice")[0],
      accountType,
      user,
      userIsLoggedIn,
    })
  }
}

invCont.processAddedVehicle=async function(req, res) {
  let nav = await utilities.getNav()
  const { inv_make,inv_model,inv_year,inv_desciption,inv_price,inv_miles,inv_color,classification_id} = req.body

  console.log(JSON.stringify(req.body))
  const jwtCookie = req.cookies.jwt;
  const verified = jwt.verify(jwtCookie, process.env.ACCESS_TOKEN_SECRET);
  console.log("Verified user data:", verified);
  const { account_type: accountType, ...user } = verified;

  const regResult = await invModel.addVehicle(
    inv_make,inv_model,inv_year,inv_desciption,inv_price,inv_miles,inv_color,classification_id
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve registered the vehicle.`
    )
    res.status(201).render("./inventory/management", {
      title: "Inventory",
      nav,
      notice: req.flash("notice")[0],
      accountType,
      user,
      userIsLoggedIn,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("./inventory/management", {
      title: "Inventory",
      nav,
      notice: req.flash("notice")[0],
      select,
      accountType,
      user,
      userIsLoggedIn,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

module.exports = invCont