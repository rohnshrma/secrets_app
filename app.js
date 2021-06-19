require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// mongoose
mongoose.connect(
  "mongodb+srv://Admin-Rohan:"+ process.env.MONGO_ADMIN_PASS +"@cluster0.2vxj1.mongodb.net/userDB",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});


userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ['password']})


// ṃodel
const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const user = new User({
    email: req.body.username,
    password: req.body.password
  });
  user.save((err) => {
    if (!err) {
      res.render("secrets");
    } else {
      console.log(err);
    }
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", (req, res) => {
  const userName = req.body.username;
  const userPassword = req.body.password;

  User.findOne({ email: userName }, (err, foundUser) => {
    if (!err) {
      if (foundUser) {
        if (foundUser.password === userPassword) {
          res.render("secrets");
        }
      }
    } else {
      console.log(err);
    }
  });
});

app.listen(3000, () => {
  console.log("server started on port : 3000");
});
