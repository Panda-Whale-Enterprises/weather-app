//server/cookieController.js
const jwt = require('jsonwebtoken');
require("dotenv").config();;

const cookieController = {};

/*
 * setSSIDCookie - store the user id in a cookie
 */
cookieController.setSSIDCookie = (req, res, next) => {
  if(res.locals.redirectSignup){
    return next() // this is true if user tried to login with a username not in the db and we are redirecting to signup
  }
  console.log('in set cookie, res.locals.userId is: ', res.locals.userId);
  if (!res.locals.userId){
    return next({
      log: 'Error in cookieController.setSSIDCookie - no user info.', 
      message: {err: 'Error setting cookies, see server log for details.'}
    })
  }
  // SERVER HANGS HERE - SOMETHING UP WITH JWT SIGNING BLOCK
  jwt.sign({ userId: res.locals.userId }, process.env.SECRET), (err, token) => {// promises not supported
    console.log(token)
    //try {
    if(err){
      return next({
        message: {err: 'Error in cookieController.setSSIDCookie.'}, 
        log: `Problem creating token: ${err}`
        })
    }
    res.cookie('ssid', token);
    return next()
    //}
    // catch (error) {
    //   return next({
    //     message: {err: 'Error in cookieController.setSSIDCookie.'}, 
    //     log: `Problem setting cookies: ${err}`
    //     })
    // }
  }
};

module.exports = cookieController;