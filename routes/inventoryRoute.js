// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inv_id", invController.buildByInv_Id)
router.get("/addinventory", invController.buildAddInventoryView);
router.get("/addclassification", invController.buildAddClassificationView);
router.post("/addclassification", invController.processAddedClassification);
router.post("/addinventory", invController.processAddedVehicle);
router.get("/getInventory/:classification_id", invController.getInventoryJSON);

module.exports = router;