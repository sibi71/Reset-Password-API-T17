const jwt = require("jsonwebtoken")

const verifyToken = (req,res,next)=>{
    const token = req.headers["authorization"];
    if(token){
        jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
            if(err){
                return res.send("Access Denied");
            }
            else{
                res.userId = decoded.id;
                next();
            }
        });
    }
};

module .exports = verifyToken;