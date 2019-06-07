var mongoose = require("mongoose");


const savingsSchema = new mongoose.Schema({
    name: String,
    amount: Number
});

module.exports =  mongoose.model("Savings", savingsSchema);