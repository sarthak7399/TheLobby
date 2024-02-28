import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;  
        if(!token) {
            return res.status(401).json({ error: "Unauthorized - No token" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if(!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid token" });
        }
        const user= await User.findById(decoded.userId).select("-password");  // Find user by id defined in the token
        if(!user) {
            return res.status(401).json({ error: "Unauthorized - Invalid user" });
        }
        req.user = user;
        next();     // Pass control to the next middleware or function
        
    } catch (error) {
        console.log("Error in protectRoute middleware.", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};

export default protectRoute;