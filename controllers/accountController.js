const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcryptjs")
const { cookie } = require("express-validator")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    userIsLoggedIn: false,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/registerr", {
    title: "Register",
    nav,
    userIsLoggedIn: false,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  console.log(JSON.stringify(req.body))

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      userIsLoggedIn: false,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      userIsLoggedIn: false,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      userIsLoggedIn: false,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  console.log(req.body)
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    console.log("Email Verification Failed")
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      userIsLoggedIn: false,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      console.log("Bcrypt Passed")
      console.log(JSON.stringify(accountData))

      // Remove sensitive information like password before signing
      delete accountData.account_password

      // Sign the JWT with the user's data
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })

      // Set the JWT in the cookie
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000, domain:'localhost', path: '/'})
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000, path: '/'})
      }

      res.redirect("/account/account/management");
    }
    else {
      console.log("Bcrypt Failed")
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        userIsLoggedIn: false,
      })
    }
  } catch (error) {
    console.log(error)
    throw new Error('Access Forbidden')
  }
}

async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav();
  const jwtCookie = req.cookies.jwt;

  if (jwtCookie) {
    try {
      // Verify the JWT to get user data
      const verified = jwt.verify(jwtCookie, process.env.ACCESS_TOKEN_SECRET);
      console.log("Verified user data:", verified);

      // Extract user and account type from the verified JWT
      const { account_type: accountType, ...user } = verified; // Destructure to separate accountType
      console.log("Account Type:", accountType);
      console.log("User Info:", user);

      res.render("account/management", {
        title: "Account Management",
        nav,
        userIsLoggedIn: true,
        user,
        accountType,
      });
    } catch (error) {
      console.error("JWT verification failed:", error);
      // JWT verification failed, redirect to login
      res.redirect("/account/account/login");
    }
  } else {
    // No JWT cookie, redirect to login
    console.log("No JWT cookie present");
    res.redirect("/account/account/login");
  }
}

async function buildUpdateAccountForm(req, res, next) {
  let nav = await utilities.getNav();
  const jwtCookie = req.cookies.jwt;

    if (jwtCookie) {
      try {
          // Verify the JWT to get user data
          const verified = jwt.verify(jwtCookie, process.env.ACCESS_TOKEN_SECRET);
          console.log("Verified user data:", verified);

          // Extract user data from the verified JWT
          const { account_type: accountType, ...user } = verified;

          // Render the update view with the user's data pre-filled
          res.render("account/updateinfo", {
              title: "Update Account Information",
              nav,
              userIsLoggedIn: true,
              user,
              accountType
          });

      } catch (error) {
          console.error("JWT verification failed:", error);
          // JWT verification failed, redirect to login or handle appropriately
          res.redirect("/account/account/login");
      }
    } else {
        // No JWT cookie, redirect to login
        console.log("No JWT cookie present");
        res.redirect("/account/account/login");
    }
}

async function updateAccountInfo(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email,account_id } = req.body

  console.log(JSON.stringify(req.body))

  const jwtCookie = req.cookies.jwt;
  const verified = jwt.verify(jwtCookie, process.env.ACCESS_TOKEN_SECRET);
  console.log("Verified user data:", verified);
  const { account_type: accountType, ...user } = verified;

  const regResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}.`
    )
    res.status(201).render("account/management", {
      title: "Login",
      nav,
      userIsLoggedIn: true,
      user,
      accountType,
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/management", {
      title: "Registration",
      nav,
      userIsLoggedIn: true,
      user,
      accountType,
    })
  }
}

async function updateAccountPassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password,account_id } = req.body

  console.log(JSON.stringify(req.body))

  const jwtCookie = req.cookies.jwt;
  const verified = jwt.verify(jwtCookie, process.env.ACCESS_TOKEN_SECRET);
  console.log("Verified user data:", verified);
  const { account_type: accountType, ...user } = verified;

  //Hash the password before storing
  let hashedPassword
  try {
    //regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/updateinfo", {
      title: "Registration",
      nav,
      errors: null,
      userIsLoggedIn: true,
      user,
      accountType,
    })
  }

  const regResult = await accountModel.updateAccountPassword(
    hashedPassword,
    account_id
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re update your account password.`
    )
    res.status(201).render("account/management", {
      title: "Login",
      nav,
      userIsLoggedIn: true,
      user,
      accountType,
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/management", {
      title: "Registration",
      nav,
      userIsLoggedIn: true,
      user,
      accountType,
    })
  }
}

async function logout(req, res, next) {
    try {
        res.clearCookie('jwt');
        res.redirect('/');
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).send('Error during logout');
    }
};

module.exports = { buildLogin , buildRegister, registerAccount, accountLogin,buildAccountManagement,buildUpdateAccountForm,updateAccountInfo, updateAccountPassword,logout}