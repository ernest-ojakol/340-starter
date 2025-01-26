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
    var className="fuck u javascript"
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

module.exports = invCont