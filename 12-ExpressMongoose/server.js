require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");

//const mongoUrl = "mongodb://127.0.0.1:27017/f1";
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const mongoUrl = `mongodb+srv://${user}:${pass}@sams.1dezmxb.mongodb.net/f1?retryWrites=true&w=majority`; 
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
// Definition of a schema
const teamSchema = new mongoose.Schema({
  id: Number,
  code: String,
  label: String,
  country: String,
  url: String,
});
teamSchema.set("strictQuery", true);

const driverSchema = new mongoose.Schema({
  num: Number,
  code: String,
  forename: String,
  surname: String,
  dob: Date,
  nationality: String,
  url: String,
  team: teamSchema,
});
driverSchema.set("strictQuery", true);

const Team = mongoose.model("Team", teamSchema);
const Driver = mongoose.model("Driver", driverSchema);

let countries = [
  { code: "ENG", label: "England" },
  { code: "SPA", label: "Spain" },
  { code: "GER", label: "Germany" },
  { code: "FRA", label: "France" },
  { code: "MEX", label: "Mexico" },
  { code: "AUS", label: "Australia" },
  { code: "FIN", label: "Finland" },
  { code: "NET", label: "Netherlands" },
  { code: "CAN", label: "Canada" },
  { code: "MON", label: "Monaco" },
  { code: "THA", label: "Thailand" },
  { code: "JAP", label: "Japan" },
  { code: "CHI", label: "China" },
  { code: "USA", label: "USA" },
  { code: "DEN", label: "Denmark" },
];
let teamsRaw = [
  {code: "mercedes", label: "Mercedes", country: "GER"},
  {code: "aston_martin", label: "Aston Martin", country: "ENG"},
]

let teams = [];
app.use("/", async (req, res, next) => {
  if(teams.length === 0){
    //load info from database
    var teamsDB = await Team.find({}).exec();
    if(!Array.isArray(teamsDB) || teamsDB.length === 0){
      // i have an array i need to populate
      await Team.insertMany(teamsRaw).then(() => {
        console.log("Teams loaded!");
      }).catch((error) => {
        console.log(error);
      });
      //TODO: load again record from the DB
    }else{
      teams = teamsDB;
    }
  }
  next();
});

app.get("/", (req, res) => {
  //res.sendFile(__dirname + "/public/html/index.html");
  res.render('index', {countries, teams});
});

app.listen(3000, (err) => {
  console.log("Listening on port 3000");
});
