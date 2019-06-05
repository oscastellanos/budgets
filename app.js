const express    = require("express"),
      app        = express(),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose");

mongoose.connect("mongodb://localhost/budget", {useNewUrlParser: true});
const port = 3000;

// SCHEMA SETUP
const budgetSchema = new mongoose.Schema({
    name: String,
    income: Number
});

const Budget = mongoose.model("Budget", budgetSchema);

// Budget.create(
//     {
//         name: "Data Scientist",
//         income: "8000"
//     }, (err, budget) => {
//         if(err){
//             console.log(err);
//         } else {
//             console.log("Newly created budget");
//             console.log(budget);
//         }
//     });

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var budgets = [
    {name: "Current Income", 
    income: 1000,
    bills: 400},
    {name: "Software Developer Income",
    income: 6000,
    bills: 400}
];
app.set("view engine", "ejs");

app.get("/", (req, res) => res.render('landing'));

app.get("/budgets", (req, res) => {
    Budget.find({}, (err, allBudgets) => {
        if(err){
            console.log(err);
        } else {
            res.render("budgets", {budgets: allBudgets})
        }
    });
    //res.render('budgets', {budgets: budgets});
});

app.post("/budgets", (req, res) => {
    const name =  req.body.name;
    const income = req.body.income;
    const newBudget = {name: name, income: income};
    budgets.push(newBudget);
    res.redirect("/budgets");
});

app.get("/budgets/new", (req, res) => {
    res.render("new");
});

app.get("/budgets/:id", (req, res) => {
    res.send("Coming soon...");
});

app.listen(port, () => console.log(`The Budget Server is listening on port ${port}!`));