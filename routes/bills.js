var     express    = require("express"),
        router     = express.Router({mergeParams: true}),
        Budget     = require("../models/budgets"),
        Bill       = require("../models/bill"),
        User       = require("../models/user"),
        middleware = require("../middleware");

// NEW
router.get("/new", middleware.isLoggedIn, (req, res) => {
    //Budget.findById(req.params.id, (err, budget) => {
    //    if(err){
    //        console.log(err);
    //    } else {
            console.log(req.user);
            res.render("bills/new", {currentUser: req.user});
     //   }
    //});
});

// CREATE
router.post("/",  middleware.isLoggedIn, (req, res) => {
    var currentUser = req.user;
    console.log(currentUser);
    
    Bill.create(req.body.bill, (err, bill) => {
        if(err){
            console.log(err);
        } else {
            bill.creator.id = currentUser._id;
            bill.creator.username = currentUser.username;
            bill.save();
            currentUser.bills.push(bill);
            currentUser.save();
            res.redirect("/dashboard");
        }
    });
       
});


// EDIT 
router.get("/:bill_id/edit", (req, res) => {
    Bill.findById(req.params.bill_id, (err, foundBill) => {
        if(err){
            res.redirect("back");
        } else {
            res.render("bills/edit", {currentUser_id: req.params.id, bill: foundBill});
        }
    });
});

// UPDATE 
router.put("/:bill_id", (req, res) => {
    Bill.findByIdAndUpdate(req.params.bill_id, req.body.bill, (err, updatedBill) => {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/dashboard");
        }
    })
});


// DESTROY
router.delete("/:bill_id", (req, res) => {
    Bill.findByIdAndRemove(req.params.bill_id, (err) => {
        if(err){
            res.redirect("/dashboard");
        } else {
            res.redirect("/dashboard");
        }
    });
});

// MAP - API
router.get("/map", middleware.isLoggedIn, (req, res) => {
    User.findById(req.user).populate("revenues").exec((err, allRevenues) => {
        if(err){
            console.log(err);
        } else {
            User.findById(req.user).populate("bills").exec((err, allBills) => {
                if(err){
                    console.log(err);
                } else {
                    data = []
                    billCategories = []
                    billTotal = 0 
                    billsMap = {} 
                    allBills.bills.forEach((bill) => {
                        billTotal = billTotal + bill.amount 
                        billCategories.push(bill.category); 
                        if(billsMap.hasOwnProperty(bill.category)) { 
                            billsMap[bill.category]++;
                        } else {
                            billsMap[bill.category] = 1;
                        }});
                    
                    res.send(billsMap);
                }
            });
        }
    });
});

module.exports = router;