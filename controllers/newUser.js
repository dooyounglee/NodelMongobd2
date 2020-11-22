module.exports = (req, res) => {
  var username = "";
  var password = "";
  console.log("newUser.js")
  console.log(req.flash("data"))
  console.log((req.flash("data"))[0])
  console.log(req.flash("validationErrors"))
  const data = req.flash("data")[0];
  console.log(typeof data)
  console.log("---------------")
  if (typeof data != "undefined") {
    username = data.username;
    password = data.password;
  }
  res.render("register", {
    errors: req.flash("validationErrors"),
    username: username,
    password: password,
  });
};
