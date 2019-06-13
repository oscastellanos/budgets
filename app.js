
const express        = require("express"),
      app            = express(),
      bodyParser     = require("body-parser"),
      mongoose       = require("mongoose"),
      seedDB         = require("./seed"),
      Budget         = require("./models/budgets"),
      Bill           = require("./models/bill"),
      passport       = require("passport"),
      flash          = require("connect-flash"),
      LocalStrategy  = require("passport-local"),
      methodOverride = require("method-override"),
      User           = require("./models/user");

const billRoutes     = require("./routes/bills"),
      budgetRoutes   = require("./routes/budgets"),
      authRoutes     = require("./routes/index"),
      dashRoutes     = require("./routes/dashboard"),
      revenueRoutes  = require("./routes/revenues");



//mongoose.connect("mongodb://localhost/budget", {useNewUrlParser: true});
const url = process.env.DATABASEURL || "mongodb://localhost/budget"
mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log("Connected to DB!");
}).catch(err => {
    console.log("ERROR:", err.message);
});
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success")
    next();
});
app.use(express.static(__dirname + '/public/stylesheets'));
app.use(authRoutes);
app.use("/budgets", budgetRoutes);
app.use("/dashboard/:id/bills", billRoutes);
app.use("/dashboard", dashRoutes);
app.use("/dashboard/:id/revenues", revenueRoutes);


app.listen(process.env.PORT, process.env.IP, () => console.log(`The Budget Server is listening on port ${port}!`));