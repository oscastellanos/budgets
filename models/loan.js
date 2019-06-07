var mongoose = require("mongoose");


const loanSchema = new mongoose.Schema({
    name: String,
    balance: Number,
    interestRate: Number,
    minMonthlyPayment: Number,
    category: String
});

module.exports =  mongoose.model("Loan", loanSchema);