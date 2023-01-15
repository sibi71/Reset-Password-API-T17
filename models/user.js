
const mongoose = require("mongoose");
const NewUserSchema =  new mongoose.Schema({
    name:String,
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type: String,
        undefined:false,
    },
   
    verified:{
        type:Boolean,
        default:false,

    }
},
{timestamps:true,});
const user = mongoose.model("Users",NewUserSchema);
module.exports=user;