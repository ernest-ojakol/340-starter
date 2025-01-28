// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")

router.get("/account/login", accountController.buildLogin);

module.exports = router;