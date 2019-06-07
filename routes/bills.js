var     express = require("express"),
        router = express.Router({mergeParams: true}),
        Budget = require("../models/budgets"),
        Bill = require("../models/bill");

// NEW
router.get("/new", isLoggedIn, (req, res) => {
    Budget.findById(req.params.id, (err, budget) => {
        if(err){
            console.log(err);
        } else {
            res.render("bills/new", {budget: budget });
        }
    });
});

// CREATE
router.post("/", (req, res) => {
    Budget.findById(req.params.id, isLoggedIn, (err, budget) => {
        if(err){
            console.log(err);
            res.redirect("/budgets");
        } else {
            Bill.create(req.body.bill, (err, bill) => {
                if(err){
                    console.log(err);
                } else {
                    bill.creator.id = req.user._id;
                    bill.creator.username = req.user.username;
                    bill.save();
                    budget.bills.push(bill);
                    budget.save();
                    res.redirect("/budgets/" + budget._id);
                }
            });
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

module.exports = router;