const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

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
  console.log("data "+JSON.stringify(data))
  console.log("Class Name "+data[0].classification_name)
  //const className
  if(data && data.length > 0){
    var className = data[0].classification_name
  }else{
    var className="dope javascript"
  }
  
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
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
    res.render("./inventory/vehicle_details", {
        title:year+" " + make + " " +model,
        nav,
        grid,
    })
}

invCont.buildManagementInv = async function(req, res, next) {
  let nav = await utilities.getNav()
  const notice = req.flash("notice")[0];
  console.log("*******************You are here*******************");
  res.render("./inventory/management", {
      nav,
      notice,
  });
};

invCont.buildAddInventoryView = async function(req, res, next) {
  let nav = await utilities.getNav()
  const select=await utilities.buildClassificationList()
  res.render("./inventory/addinventory", {
      messages:"Successfully Added/Failed to Add",
      nav,
      select,
  });
};

invCont.buildAddClassificationView = async function(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/addclassification", {
      messages:"Successfully Added/Failed to Add",
      nav,
  });
};

invCont.processAddedClassification=async function(req, res) {
  let nav = await utilities.getNav()
  const { classification_name} = req.body

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
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("./inventory/management", {
      title: "Inventory",
      nav,
      notice: req.flash("notice")[0],
    })
  }
}

invCont.processAddedVehicle=async function(req, res) {
  let nav = await utilities.getNav()
  const { inv_make,inv_model,inv_year,inv_desciption,inv_price,inv_miles,inv_color,classification_id} = req.body

  console.log(JSON.stringify(req.body))

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
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("./inventory/management", {
      title: "Inventory",
      nav,
      notice: req.flash("notice")[0],
    })
  }
}

module.exports = invCont