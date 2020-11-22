const User = require("../models/User.js");
const path = require("path");
module.exports = (req, res) => {
  User.create(req.body, (error, user) => {
    if (error) {
      console.log("storeUser.js")
      console.log(req.body)
      console.log(error)
      console.log(Object.keys(error.errors))
      const validationErrors = Object.keys(error.errors).map(
        (key) => {console.log(key);console.log(error.errors[key])
          return error.errors[key].message
        }
      );
      console.log(validationErrors);
      console.log(req.body)
      console.log("-------------")
      //req.session.validationErrors = validationErrors;
      req.flash('validationErrors',validationErrors);
      req.flash('data',req.body);
      return res.redirect("/auth/register");
    }
    res.redirect("/");
  });
};
