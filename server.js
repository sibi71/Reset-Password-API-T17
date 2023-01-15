const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const userRoute = require("./routes/user")
const bodyParser = require("body-parser");
const methodOverride = require('method-override')


const app = express();
const port = process.env.PORT || 4000 ; 

connectDB();

app.use(express.json())

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}))

app.use(methodOverride('_method'))

app.use(express.static("public"));

app.use("/",userRoute);




app.listen(port,()=>{
    console.log(`server is up and running on port ${port}`);
})
