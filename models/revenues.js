var mongoose = require("mongoose");


const revenueSchema = new mongoose.Schema({
    name: String,
    amount: Number,
    category: String,
    creator: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports =  mongoose.model("Revenue", revenueSchema);