// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")

router.get("/account/login", utilities.handleErrors(accountController.buildLogin));
router.post("/account/login", utilities.handleErrors(accountController.accountLogin));
router.get("/account/registerr", utilities.handleErrors(accountController.buildRegister));
router.post("/account/registerr", utilities.handleErrors(accountController.registerAccount));
router.get("/account/management", utilities.handleErrors(accountController.buildAccountManagement));
router.get("/account/update/:account_id", utilities.handleErrors(accountController.buildUpdateAccountForm));
router.post("/account/update/", utilities.handleErrors(accountController.updateAccountInfo));
router.post("/account/updatePassword/", utilities.handleErrors(accountController.updateAccountPassword));
router.get("/account/logout/", utilities.handleErrors(accountController.logout));
router.get("/account/updateother/", utilities.handleErrors(accountController.buildUpdateUser));
router.post("/account/updateother/", utilities.handleErrors(accountController.updateOtherAccountPassword));

module.exports = router;