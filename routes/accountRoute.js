// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")

router.get("/account/login", accountController.buildLogin);
router.get("/account/registerr", accountController.buildRegister)
router.post('/account/registerr', utilities.handleErrors(accountController.registerAccount))

module.exports = router;