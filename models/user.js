var mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    budgets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Budget"
        }
    ],
    bills: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bill"
        }
    ], 
    revenues: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Revenue"
        }
    ]
});

userSchema.plugin(passportLocalMongoose);

module.exports =  mongoose.model("User", userSchema);