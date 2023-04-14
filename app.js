//requirements
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local");
const User = require("./model/User");
const Contact = require("./model/Contact");

//declarations
const app = express();
const port = 5000;
var saveCurectUser = "";


//connect db
try {
    mongoose.connect("mongodb://localhost/ContactApp");
    console.log("DB connected");
} catch (error) {
    console.error("DB failed to connected", error);
    process.exit(1);
}

//app specifications
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, '/views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "MySecret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//passport specifications
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//app start
app.listen(port, function () {
    console.log("Server started on port " + port);
    
});

//User
function isLoggedIn(req, res, next) {
    console.log('isLoggedIn middleware called');
    console.log('req.isAuthenticated():', req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
        
    res.redirect("/login");
}


//* ROUTES

//Default page
app.get("/", function (req, res) {
    res.render("home");
});

//REGISTER
//Register page
app.get("/register", function (req, res) {
    res.render("register");
});
//Register form handling
app.post('/register', async (req, res) => {
    try{
        // Check if username already exists in the database
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            const error = "Username already exists!";
            res.render("register", { error });
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password,salt);

            const data = {
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            }

            await User.insertMany([data]); //mongodb save

            res.render("login");
        }

    } catch (error) {
        res.status(400).json({ error });
    }
});



//LOGIN
//Login page
app.get("/login", function (req, res) {
    res.render("login");
});
//Login form handling
app.post("/login", async function(req, res){
    try {
        //if user exists
        const user = await User.findOne({ username: req.body.username });
        if (user) {
            //if password matches
            const match = await bcrypt.compare(req.body.password, user.password);
            if (match) {
                req.login(user, async function(err) {
                    if (err) { return next(err); }

                    saveCurectUser = req.body.username;
                    console.log(saveCurectUser);
                
                    var data =  await Contact.find({owner: saveCurectUser});
                    res.render('contacts', { contacts: data, ownerName: saveCurectUser});

                });
            } else {
                res.render('login', { error: "wrong username or password" });
            }
        } else {
            res.render('login', { error: "wrong username or password" });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
});


//CONTACTS PAGE
//Rendering contacts (main page after logged in)
app.get("/contacts", isLoggedIn, async (req, res) => {
    var data =  await Contact.find({owner: saveCurectUser});
    res.render('contacts', { contacts: data, ownerName: saveCurectUser });
});


//CRUD

//CREATE
//Create new contact page
app.get("/create", isLoggedIn, function (req, res) {
    res.render("create");
    console.log(saveCurectUser)
});
//Create new contact handling
app.post('/create', async (req, res) => {
    const contact = await Contact.create({
        owner: saveCurectUser,
        name: req.body.surname,
        surname: req.body.name,
        email: req.body.email,
        tel: req.body.tel,
        address: req.body.address,
    })

    res.redirect("/contacts");
});

//EDIT
//load relevant data
app.post("/editReq", isLoggedIn, async (req, res) => {
    const id = req.body.contactId;
    const data = await Contact.findById(id);

    res.render("edit", {contact: data})
})
//save data
app.post('/edit', isLoggedIn, async (req, res) => {
    try {
      const { id, name, surname, email, tel, address } = req.body;
      await Contact.findByIdAndUpdate(id, { name, surname, email, tel, address });
      res.redirect('contacts');
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
});
  

//DELETE
//load relevant data
app.post('/delete', isLoggedIn, async (req, res) => {
    const id = req.body.id;
    const action = req.body.action;
    
    if (action === 'delete') {
      await Contact.findByIdAndDelete(id);
      res.redirect("contacts");
    } else {
      res.redirect('contacts'); 
    }
  });
//confirmation
app.post("/deleteReq", isLoggedIn, async (req, res) => {
    const id = req.body.contactId;
    const data = await Contact.findById(id);

    console.log(data);
    res.render("delete", {contact: data})
});


//User logout
app.get("/logout", function (req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
		req.session.destroy(); // destroy session data
        res.redirect('/');
        saveCurectUser="";
    });
});