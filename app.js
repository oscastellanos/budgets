
const express        = require("express"),
      app            = express(),
      bodyParser     = require("body-parser"),
      mongoose       = require("mongoose"),
      seedDB         = require("./seed"),
      Budget         = require("./models/budgets"),
      Bill           = require("./models/bill"),
      passport       = require("passport"),
      LocalStrategy  = require("passport-local"),
      methodOverride = require("method-override"),
      User           = require("./models/user");

const billRoutes     = require("./routes/bills"),
      budgetRoutes   = require("./routes/budgets"),
      authRoutes     = require("./routes/index");



mongoose.connect("mongodb://localhost/budget", {useNewUrlParser: true});
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Hello",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use(authRoutes);
app.use("/budgets", budgetRoutes);
app.use("/budgets/:id/bills", billRoutes);


app.listen(port, () => console.log(`The Budget Server is listening on port ${port}!`));