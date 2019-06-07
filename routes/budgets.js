var express = require("express");
var router = express.Router({mergeParams: true});
var Budget = require("../models/budgets");

// INDEX - SHOW ALL BUDGETS
router.get("/", (req, res) => {
    Budget.find({}, (err, allBudgets) => {
        if(err){
            console.log(err);
        } else {
            res.render("budgets/index", {budgets: allBudgets, currentUser: req.user})
        }
    });
    //res.render('budgets', {budgets: budgets});
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
router.get("/new", isLoggedIn, (req, res) => {
    res.render("budgets/new");
});

// SHOW - shows more info about a specific budget
router.get("/:id", isLoggedIn, (req, res) => {
    //res.send("Coming soon...");
    Budget.findById(req.params.id).populate("bills").exec((err, foundBudget) => {
        if(err){
            console.log(err);
        } else {
            console.log(foundBudget);
            res.render("budgets/show", {budget: foundBudget});
        }
    });
});

// EDIT 
router.get("/:id/edit", checkBudgetOwnership, (req, res) => {
        Budget.findById(req.params.id, (err, foundBudget) => {
            res.render("../views/budgets/edit", {budget:foundBudget});
        });
});

// UPDATE 
router.put("/:id", checkBudgetOwnership, (req, res) => {
    Budget.findByIdAndUpdate(req.params.id, req.body.budget, (err, updatedBudget) => {
        if(err){
            res.redirect("/budgets");
        } else {
            res.redirect("/budgets/" + req.params.id);
        }
    })
});


// DESTROY
router.delete("/:id", checkBudgetOwnership, (req, res) => {
    Budget.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            res.redirect("/budgets");
        } else {
            res.redirect("/budgets");
        }
    });
});


//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkBudgetOwnership(req, res, next){
    if(req.isAuthenticated()){
        Budget.findById(req.params.id, (err, foundBudget) => {
            if(err){
                res.redirect("back");
            } else {
                if(foundBudget.creator.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
                
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;