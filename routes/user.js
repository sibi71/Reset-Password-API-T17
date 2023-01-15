const router = require("express").Router();
const bcrypt = require("bcrypt");
const User =  require("../models/user");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/authenticate");
const { application } = require("express");
const { assign } = require("nodemailer/lib/shared");

const port = process.env.POST || 4000;

router.get("/",(req,res)=>{
    res.render("login")
})
router.get("/signup",(req,res)=>{
    res.render("signup")
})

router.get("/fwd",(req,res)=>{
    res.render("FWD");
});
router.get("/reset",(req,res)=>{
    res.render("reset");
});

router.post("/signup",async (req,res)=>{
    try{
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    const userdata = new User({
        name :req.body.name,
        email:req.body.email,
        password:password,
    });
    const  result = await userdata.save();
    const token = jwt.sign({id:result._id},process.env.SECRET_KEY)
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"thetemp24@gmail.com",
            pass:process.env.MAIL_PWD,
        },
    });
    let info = await transporter.sendMail({
        from:"AS Team <thetemp24@gmail.com>",
        to:req.body.email,
        subject:"Verify your Email - AS Team",
        html:`
        <div>
        <strong>${req.body.name}</strong> we welcome to our platform.
        <a style = "" href="http://localhost:${port}/verify/${token}">Verify Email </a>
        <div>
        <p>Thanks and Regards</p>
        <p> From AS Team </p>
        </div>
        </div>
        `
    });
        res.send(result)
}
    catch(error){
        console.log(error);
    }

});
router.post("/login",async (req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email});
        if(user){
            const result = await bcrypt.compare(req.body.password,user.password);
            if(result){
                if(!user.verified){
                    return res.send("Verify your account first checkout your email")
                }
                const token = jwt.sign({id:user._id},process.env.SECRET_KEY);
                return res.json(token);

            }else{
                return res.send("Wrong password");
            }
        }
    }
    catch(error){
            return  console.log(error);
    }
});


router.get("/data",verifyToken,async(req,res)=>{
    try {
        const userId = req.userId;
        const user = await User.findById({_id:userId});
        res.json(user);
    } catch (error) {
            console.log(error);
            return res.json({msg:error.message});
        
        }
}); 

router.get("/verify/:token",async(req,res)=>{
    try {
        const token = req.params.token;
        jwt.verify(token,process.env.SECRET_KEY,async(err,decoded)=>{
            if(err){
                return res.send("invalid url");
            }
            else{
                const user = await User.findByIdAndUpdate(decoded.id,{
                    verified:true,
                });
                return res.send("Account Verified");
            }
        })
    } catch (error) {
        console.log(error);
    }
})

router.post("/fwd", async (req,res)=>{
    try {
        const users = await User.findOne({email:req.body.email})
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"thetemp24@gmail.com",
                pass:process.env.MAIL_PWD,
            },
        });
        let info = await transporter.sendMail({
            from:"AS Team <thetemp24@gmail.com>",
            to:req.body.email,
            subject:"Reset Password - AS Team",
            html:`
            <div>
            we welcome to our platform.
            <a style = "" href="http://localhost:${port}/reset">Reset Password..</a>
            <div>
            <p>Thanks and Regards</p>
            <p> From AS Team </p>
            </div>
            </div>
            `
        });
            res.send("please check out your email")

    } catch (error) {
        
    }
})
router.put("/update",async (req,res)=>{
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
   const Users = await User.findByIdAndUpdate(req.body.id,
    {
         password:password,
    },
     {new:true}
    );
        res.send(Users);
    })



module.exports= router;