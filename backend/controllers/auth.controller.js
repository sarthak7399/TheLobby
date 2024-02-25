import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookies from "../utils/generateToken.js";
export const signup = async(req, res) => {
    try{
        const {fullName,userName,password,confirmPassword,gender} = req.body;

        if(password!=confirmPassword){
            return res.status(400).json({ success: false, message: "Passwords do not match"});

        }

        const user = await User.findOne({username: userName});

        if(user){
            return res.status(400).json({ success: false, message: "User already exists"});
        }
        // Hash Password Here
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        // https://avatar.iran.liara.run/
        const boyProfilePic = "https://avatar.iran.liara.run/public/boy?username=${username}";
        const girlProfilePic = "https://avatar.iran.liara.run/public/girl?username=${username}";

        const newUser = new User({
            userName: userName,
            fullName: fullName,
            password: hashedPassword,
            gender: gender,
            profilePic: gender == "male" ? boyProfilePic : girlProfilePic
        });
        await newUser.save();
        
        if(newUser){
            // Generate JWT Token
            generateTokenAndSetCookies(newUser._id, res); //generateTokenAndSetCookies;

            await newUser.save();

            res.status(201).json({ 
                _id:newUser._id,
                fullName: newUser.fullName,
                userName: newUser.userName,
                gender: newUser.gender,
                profilePic: newUser.profilePic
        });
        }  else {
            res.status(400).json({ error: "Invalid user data"});
        }

    }
    catch (error){
        console.log("Error in signup controller.", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}

export const login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await User.findOne({ userName });
        const isPasswordCorrect = await bcrypt.compare(password, user.password || "" );
        if (!user || !isPasswordCorrect) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        // Generate JWT Token
        generateTokenAndSetCookies(user._id, res);

        res.status(200).json({ 
            _id:user._id,
            fullName: user.fullName,
            userName: user.userName,
            gender: user.gender,
            profilePic: user.profilePic
        });
        
    } catch (error) {
        console.log("Error in login controller.", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0
        });
        res.status(200).json({ success: true, message: "Logged out successfully" });
        
    } catch (error) {
        console.log("Error in logout controller.", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}
