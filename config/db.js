const mongoose = require("mongoose")

const url = process.env.MONGO_URI;
mongoose.set("strictQuery",false)

const connectDB = async()=>{
    try{
        const connect = await mongoose.connect(url);

        console.log(`mongoDB connected ${connect.connection.host}`);

    }
    catch(err){
        console.log(err);
    }
}
module.exports=connectDB;