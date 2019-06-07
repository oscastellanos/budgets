var mongoose = require("mongoose");
var Budget = require("./models/budgets");
var Bill = require("./models/bill")
data = [
    {
        name: "Web Developer",
        income: 5000,
        costs: 2000,
        profit: 3000
    }, 
    {
        name: "Data Scientist",
        income: 8000,
        costs: 2000,
        profit: 6000
    }
]

function seedDB(){
    Budget.remove({}, (err) => {
        if(err){
            console.log(err);
        }
        console.log("Removed budgets!");
        // add a few budgets
        data.forEach((seed) => {
            Budget.create(seed, (err, budget) => {
                if(err){
                    console.log(err);
                } else {
                    console.log("added a budget");
                    Bill.create(
                        {
                            name: "Water",
                            amount: 55,
                            category: "living"
                        }, (err, bill) => {
                            if(err){
                                console.log(err);
                            } else {
                                budget.bills.push(bill);
                                budget.save();
                                console.log("Created new bill")
                            }
                        });
                }
            });
        });
    });
    
}

module.exports = seedDB;