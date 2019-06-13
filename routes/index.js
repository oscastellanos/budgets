var     express  = require("express"),
        router   = express.Router(),
        passport = require("passport"),
        User     = require("../models/user");

// LANDING
router.get("/", (req, res) => res.render('landing'));


// show register form
router.get("/register", (req, res) => {
    res.render("register", {page: "register"});
});

// handle sign-up logic
router.post("/register", (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user)=>{
        if(err){
            return res.render("register", {"error":err.message});
        } 
        passport.authenticate("local")(req, res, () => {
            res.redirect("/dashboard");
        });
        
    });
});

// show login form
router.get("/login", (req, res)=>{
    res.render("login", {page:'login'});
});

//handle login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/dashboard",
        failureRedirect: "/login" 
    }),(req, res) => {
});

// logout route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "You are logged out.");
    res.redirect("/");
});

module.exports = router;