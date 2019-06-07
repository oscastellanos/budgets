var mongoose = require("mongoose");


const creditcardSchema = new mongoose.Schema({
    name: String,
    balance: Number,
    interestRate: Number,
    minMonthlyPayment: Number
});

module.exports =  mongoose.model("Creditcard", creditcardSchema);