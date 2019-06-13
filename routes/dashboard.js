var express    = require("express"),
    router     = express.Router({mergeParams: true}),
    Budget     = require("../models/budgets"),
    User       = require("../models/user"),
    Bill       = require('../models/bill'),
    Revenue    = require("../models/revenues"),
    middleware = require("../middleware");

// INDEX - SHOW THE DASHBOARD FOR ALL DATA
router.get("/", middleware.isLoggedIn, (req, res) => {
    User.findById(req.user).populate("revenues").exec((err, allRevenues) => {
        if(err){
            console.log(err);
        } else {
            User.findById(req.user).populate("bills").exec((err, allBills) => {
                if(err){
                    console.log(err);
                } else {
                    // console.log(allBills);
                    res.render("dashboard/index", {currentUser: req.user, allBills: allBills, allRevenues: allRevenues}) 
                }
            });
        }
    });
   
});



// CREATE - add a new budget to DB
// router.post("/", (req, res) => {
//     const name =  req.body.name;
//     const income = req.body.income;
//     const creator = {
//         id: req.user._id,
//         username: req.user.username
//     }
//     const newBudget = {name: name, income: income, creator: creator};
//     Budget.create(newBudget, (err, newlyCreated) => {
//         if(err){
//             console.log(err);
//         } else {
//             res.redirect("/budgets");
//         }
//     });
// });

// CREATE -- add a bill to a user's account
router.post("/",  middleware.isLoggedIn, (req, res) => {
    User.findById(req.params.id,(err, foundUser) => {
        if(err || !foundUser){
            req.flash("error", "User not found.")
            res.redirect("/dashboard");
        } else {
            Bill.create(req.body.budget, (err, budget) => {
                if(err){
                    console.log(err);
                } else {
                    foundUser.budget.push(budget);
                    foundUser.save();
                    //res.redirect("/budgets/" + budget._id);
                    res.redirect("/budgets");
                }
            });
        }
    });
});



// NEW
router.get("/new", middleware.isLoggedIn, (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if(err || !foundUser){
            req.flash("error", "User not found.")
            res.redirect("/budgets");
        } else {
            res.render("budgets/new", {user: foundUser});
        }
    });
});
// NEW - show form to create a new budget
//router.get("/new", middleware.isLoggedIn, (req, res) => {
//    res.render("budgets/new");
//});

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