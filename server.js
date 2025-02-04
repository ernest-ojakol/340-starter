/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const utilities = require("./utilities/")
const session = require("express-session")
const pool = require('./database')
const bodyParser = require("body-parser")
const invController = require("./controllers/invController")
//const session = require("express-session")

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* ***********************
 * Routes
 *************************/
/* ***********************
 * View Engine and Templates
 *************************/

app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

app.use(static)

 /* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
 const port = 5500
 const host = 'localhost'

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

// Index Route
// app.get("/",function(req,res){
//   res.render("index", {title:"Home"})
// })
//app.get("/",baseController.buildHome)
app.get("/",utilities.handleErrors(baseController.buildHome))
// Inventory routes
app.use("/inv", inventoryRoute)
app.get("/inv", invController.buildManagementInv);
app.use("/account", accountRoute)
// {
//   res.render("index", {title:"Home"})
// })
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
// const express = require("express")
// const dotenv = require("dotenv").config()
// const app = express()

// // Routes
// const staticRoute = require("./routes/static")
// const inventoryRoute = require("./routes/inventoryRoute")

// // Controllers
// const baseController = require("./controllers/baseController")

// // Utilities
// const utilities = require("./utilities/")

// // Express Layouts
// const expressLayouts = require("express-ejs-layouts")

// /* ***********************
//  * App Setup and Configuration
//  *************************/
// // View Engine and Layouts
// app.set("view engine", "ejs")
// app.use(expressLayouts)
// app.set("layout", "./layouts/layout") // not at views root

// // Middleware
// app.use(express.json()) // For parsing application/json
// app.use(express.urlencoded({ extended: true })) // For parsing application/x-www-form-urlencoded

// // Static Route
// app.use(staticRoute)

// /* ***********************
//  * Routes
//  *************************/

// // Index Route (Home)
// app.get("/", utilities.handleErrors(baseController.buildHome))

// // Inventory Routes
// app.use("/inv", inventoryRoute)

// /* ***********************
//  * Express Error Handler
//  * Place after all other middleware
//  *************************/
// // app.use(async (err, req, res, next) => {
// //   try {
// //     // Generate nav dynamically
// //     let nav = await utilities.getNav()

// //     // Log the error for debugging
// //     console.error(`Error at: "${req.originalUrl}": ${err.message}`)

// //     // Render the error page
// //     res.status(err.status || 500).render("errors/error", {
// //       title: err.status || "Server Error",
// //       message: err.message,
// //       nav
// //     })
// //   } catch (error) {
// //     // Fallback for any issues that occur in error handling itself
// //     console.error("Error in error handler:", error)
// //     res.status(500).send("Internal Server Error")
// //   }
// // })
// app.use(async (err, req, res, next) => {
//   let nav = await utilities.getNav()
//   console.error(`Error at: "${req.originalUrl}": ${err.message}`)
//   if(err.status == 404){
//     message = err.message} 
//     else {
//     message = 'Oh no! There was a crash. Maybe try a different route?'
//   }
//   res.render("errors/error", {
//     title: err.status || 'Server Error',
//     message,
//     nav
//   })
// })

// /* ***********************
//  * File Not Found Route
//  *************************/
// // Catch-all for undefined routes (404 error)
// // app.use(async (req, res, next) => {
// //   next({ status: 404, message: 'Sorry, we appear to have lost that page.' })
// // })
// // 404 handler for undefined routes
// app.use((req, res, next) => {
//   res.status(404).send("Sorry, we couldn't find that page!");
// });

// /* ***********************
//  * Local Server Information
//  *************************/
// const port = process.env.PORT || 5500
// const host = process.env.HOST || 'localhost'

// /* ***********************
//  * Server Start
//  *************************/
// app.listen(port, () => {
//   console.log(`app listening on http://${host}:${port}`)
// })

