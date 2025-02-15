// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")

router.get("/account/login", accountController.buildLogin);
router.post("/account/login", accountController.accountLogin);
router.get("/account/registerr", accountController.buildRegister);
router.post("/account/registerr", utilities.handleErrors(accountController.registerAccount));
router.get("/account/management", accountController.buildAccountManagement);
router.get("/account/update/:account_id", accountController.buildUpdateAccountForm);
router.post("/account/update/", accountController.updateAccountInfo);
router.post("/account/updatePassword/", accountController.updateAccountPassword);
router.get("/account/logout/", accountController.logout);

module.exports = router;