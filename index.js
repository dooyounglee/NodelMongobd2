const express = require("express");
const path = require("path");

//const db_env = require("./env.json");
const mongoose = require("mongoose");
//mongoose.connect("mongodb://localhost/my_database", { useNewUrlParser: true });
//const uri = "mongodb+srv://"+db_env.mongDB_id+":"+db_env.mongoDB_pw+"@cluster0.ixfsd.mongodb.net/"+db_env.mongoDB_dbnm+"?retryWrites=true&w=majority";
const uri = "mongodb+srv://"+process.env.mongDB_id+":"+process.env.mongoDB_pw+"@cluster0.ixfsd.mongodb.net/"+process.env.mongoDB_dbnm+"?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true },   () => console.log(" Mongoose is connected"))

const app = new express();
const ejs = require("ejs");
app.set("view engine", "ejs");

app.use(express.static("public"));

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const fileUpload = require("express-fileupload");
app.use(fileUpload());

const customMiddleWare = (req, res, next) => {
  console.log("Custom middle ware called");
  next();
};
//app.use(customMiddleWare);

//middleware
const validateMiddleware = require("./middleware/validateMiddleware");
/*const validateMiddleWare = (req, res, next) => {
  if (req.files == null || req.body.title == null || req.body.title == null) {
    return res.redirect("/posts/new");
  }
  next();
};*/
const authMiddleware = require("./middleware/authMiddleware");
const redirectIfAuthenticatedMiddleware = require("./middleware/redirectIfAuthenticatedMiddleware");

app.use("/posts/store", validateMiddleware);

const expressSession = require("express-session");
app.use(
  expressSession({
    secret: "keyboard cat",
  })
);

global.loggedIn = null;
app.use("*", (req, res, next) => {
  loggedIn = req.session.userId;
  next();
});

const flash = require('connect-flash');
app.use(flash());

let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}
app.listen(port, () => {
  console.log("App listening on port 4000");
});

//models
const BlogPost = require("./models/BlogPost.js");
const storeUserController = require("./controllers/storeUser");

//controllers
const newPostController = require("./controllers/newPost");
const homeController = require("./controllers/home");
const storePostController = require("./controllers/storePost");
const getPostController = require("./controllers/getPost");
const newUserController = require("./controllers/newUser");
const loginController = require("./controllers/login");
const loginUserController = require("./controllers/loginUser");
const logoutController = require("./controllers/logout");

app.get("/auth/register", redirectIfAuthenticatedMiddleware, newUserController);
app.get("/auth/login", redirectIfAuthenticatedMiddleware, loginController);
app.get("/auth/logout", logoutController);

app.post(
  "/users/register",
  redirectIfAuthenticatedMiddleware,
  storeUserController
);
app.post(
  "/users/login",
  redirectIfAuthenticatedMiddleware,
  loginUserController
);

app.get("/", homeController);
/*app.get("/", async (req, res) => {
  const blogposts = await BlogPost.find({});
  console.log(blogposts);
  res.render("index", {
    blogposts,
  });
});*/
/*app.get("/about", (req, res) => {
  //res.sendFile(path.resolve(__dirname,'pages/about.html'))
  res.render("about");
});
app.get("/contact", (req, res) => {
  //res.sendFile(path.resolve(__dirname,'pages/contact.html'))
  res.render("contact");
});
app.get("/post", (req, res) => {
  //res.sendFile(path.resolve(__dirname,'pages/post.html'))
  res.render("post");
});*/
/*app.get("/posts/new", (req, res) => {
  res.render("create");
});*/
app.get("/posts/new", authMiddleware, newPostController);

app.post("/posts/store", authMiddleware, storePostController);
/*app.post("/posts/store", (req, res) => {
  console.log(req.body);
  let image = req.files.image;
  image.mv(path.resolve(__dirname, "public/img", image.name), async (error) => {
    await BlogPost.create({ ...req.body, image: "/img/" + image.name });
    res.redirect("/");
  });
});*/
app.get("/post/:id", getPostController);
/*app.get("/post/:id", async (req, res) => {
  console.log(req.params.id);
  const blogpost = await BlogPost.findById(req.params.id);
  console.log(blogpost);
  res.render("post", { blogpost });
});*/

app.use((req, res) => res.render('notfound'));

/*app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "pages/index.html"));
});
app.get("/about", (req, res) => {
  res.sendFile(path.resolve(__dirname, "pages/about.html"));
});
app.get("/contact", (req, res) => {
  res.sendFile(path.resolve(__dirname, "pages/contact.html"));
});
app.get("/post", (req, res) => {
  res.sendFile(path.resolve(__dirname, "pages/post.html"));
});*/
