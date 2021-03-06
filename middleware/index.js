const Budget        = require("../models/budgets"),
      Bill          = require("../models/bill"),
      middlewareObj = {},
      passingData = {};

middlewareObj.checkBudgetOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Budget.findById(req.params.id, (err, foundBudget) => {
            if(err || !foundBudget){
                req.flash("error", "Budget not found.");
                res.redirect("back");
            } else {
                if(foundBudget.creator.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

middlewareObj.checkBillOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Bill.findById(req.params.id, (err, foundBill) => {
            if(err || !foundBill){
                req.flash("error", "Bill not found.");
                res.redirect("back");
            } else {
                if(foundBill.creator.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = (req, res, next) =>{
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}



module.exports = middlewareObj
