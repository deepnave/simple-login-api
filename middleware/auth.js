import dotenv from "dotenv";
dotenv.config()
import jwt from "jsonwebtoken";

function authinticateToken(req, res, fn){
try{
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if(!token) return res.status(401).json({message: "No token provided."});
        jwt.verify(token, process.env.JWT_SECRET, (error, dedcodedPayload)=>{
            if(error) return res.status(403).json({message: "Invalid or expired token"});
            req.id = dedcodedPayload.id;
            fn();
        })
    } catch(error){return res.json(error)}
}

export default authinticateToken;