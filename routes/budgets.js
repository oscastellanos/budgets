var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    Budget     = require("../models/budgets"),
    User       = require("../models/user");
    middleware = require("../middleware");

// INDEX - SHOW ALL BUDGETS
router.get("/", (req, res) => {
    Budget.find({}, (err, allBudgets) => {
        if(err){
            console.log(err);
        } else {
            res.render("budgets/index", {budgets: allBudgets, currentUser: req.user, page: "budgets"})
        }
    });
});


// CREATE - add a new budget to DB
router.post("/", (req, res) => {
    const name =  req.body.name;
    const income = req.body.income;
    const creator = {
        id: req.user._id,
        username: req.user.username
    }
    const newBudget = {name: name, income: income, creator: creator};
    Budget.create(newBudget, (err, newlyCreated) => {
        if(err){
            console.log(err);
        } else {
            res.redirect("/budgets");
        }
    });
});

// NEW - show form to create a new budget
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("budgets/new");
});

// SHOW - shows more info about a specific budget
router.get("/:id", middleware.isLoggedIn, (req, res) => {
    Budget.findById(req.params.id).populate("bills").exec((err, foundBudget) => {
        if(err || !foundBudget){
            req.flash("error", "Budget not found.")
            res.redirect("/budgets");
        } else {
            res.render("budgets/show", {budget: foundBudget});
        }
    });
});

// EDIT 
router.get("/:id/edit", middleware.checkBudgetOwnership, (req, res) => {
        Budget.findById(req.params.id, (err, foundBudget) => {
            res.render("../views/budgets/edit", {budget:foundBudget});
        });
});

// UPDATE 
router.put("/:id", middleware.checkBudgetOwnership, (req, res) => {
    Budget.findByIdAndUpdate(req.params.id, req.body.budget, (err, updatedBudget) => {
        if(err){
            res.redirect("/budgets");
        } else {
            res.redirect("/budgets/" + req.params.id);
        }
    })
});


// DESTROY
router.delete("/:id", middleware.checkBudgetOwnership, (req, res) => {
    Budget.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            res.redirect("/budgets");
        } else {
            res.redirect("/budgets");
        }
    });
});


module.exports = router;