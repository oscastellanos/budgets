var     express    = require("express"),
        router     = express.Router({mergeParams: true}),
        Revenue    = require("../models/revenues"),
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
            res.render("revenues/new", {currentUser: req.user});
     //   }
    //});
});

// CREATE
router.post("/",  middleware.isLoggedIn, (req, res) => {
    var currentUser = req.user;
    console.log(currentUser);
    
    Revenue.create(req.body.revenue, (err, revenue) => {
        if(err){
            console.log(err);
        } else {
            revenue.creator.id = currentUser._id;
            revenue.creator.username = currentUser.username;
            revenue.save();
            currentUser.revenues.push(revenue);
            currentUser.save();
            res.redirect("/dashboard");
        }
    });
       
});

// EDIT 
router.get("/:revenue_id/edit", (req, res) => {
    Revenue.findById(req.params.revenue_id, (err, foundRevenue) =>{
        if(err){
            res.redirect("back");
        } else {
            res.render("revenues/edit", {currentUser_id: req.params.id, revenue: foundRevenue});
        }
    });
});

// UPDATE 
router.put("/:revenue_id", (req, res) => {
    Bill.findByIdAndUpdate(req.params.revenue_id, req.body.revenue, (err, updatedRevenue) => {
        if(err){
            req.flash("error", "Something did not post correctly.");
            res.redirect("/dashboard");
        } else {
            res.redirect("/dashboard");
        }
    })
});


// DESTROY
router.delete("/:revenue_id", (req, res) => {
    Revenue.findByIdAndRemove(req.params.revenue_id, (err) => {
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
            User.findById(req.user).populate("revenues").exec((err, allRevs) => {
                if(err){
                    console.log(err);
                } else {
                    data = []
                    revenueCategories = []
                    revenueTotal = 0 
                    revenuesMap = {} 
                    allRevs.revenues.forEach((rev) => {
                        revenueTotal = revenueTotal + rev.amount 
                        revenueCategories.push(rev.category); 
                        if(revenuesMap.hasOwnProperty(rev.category)) { 
                            revenuesMap[rev.category]++;
                        } else {
                            revenuesMap[rev.category] = 1;
                        }});
                    
                    res.send(revenuesMap);
                }
            });
        }
    });
});

module.exports = router;