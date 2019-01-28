const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const pug = require('pug');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'pug')


mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', {
    useNewUrlParser: true
});

const VisitorSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
});
const Visitor = mongoose.model("Visitor", VisitorSchema);



app.get("/index", async (req, res) => {

    await Visitor.find({}, async function (err, data) {
        res.render('index', {
            visitors: data
        });
    });
});

app.get("/", async (req, res) => {
    res.render('login');
});

app.get("/register", async (req, res) => {
    res.render('signup');
});


app.post("/register", async (req, res) => {

    await Visitor.findOne({
        email: req.body.email
    }, async function (err, data) {
        if (data) {
            res.render('signup', { message: 'This account already exists'});
        } else {
            const visitor = new Visitor({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });
            await visitor.save()
        }
        res.redirect('/index');
    });
});

app.get("/login", async (req, res) => {
    res.render('login');
});


app.post("/login", async (req, res) => {

    await Visitor.findOne({
        email: req.body.email,
        password: req.body.password
    }, async function (err, data) {
        console.log(data);
        if (data) {
            res.redirect('/index');
        }else{
            res.render('login', { message: 'Wrong email or password. Try again!'})
        }
    });
});


app.listen(3000, () => console.log("Listening on port 3000 ..."));