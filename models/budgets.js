var mongoose = require("mongoose");


const budgetSchema = new mongoose.Schema({
    name: String,
    income: Number,
    costs: Number,
    profit: Number,
    bills: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bill"
        }
    ],
    creator: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
    // creditcards: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Credit Card"
    //     }
    // ],
    // loans: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Loan"
    //     }
    // ], 
    // savings: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Savings"
    //     }
    // ]
});

module.exports =  mongoose.model("Budget", budgetSchema);