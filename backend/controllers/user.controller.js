import User from "../models/user.models.js";
const getUsersForSidebar = async (req, res) => {
    try {
        const loggerInUser = req.user._id;      // We are taking loggerInUser from the cookies as input
        const filteredUsers = await User.find({ _id: { $ne: loggerInUser } }).select("-password");    // Find all users except loggerInUser, $ne means not equal which is part of mongodb
        res.status(200).json(filteredUsers);

    } catch (error) {
        console.log("Error in getUsersForSidebar controller.", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};

export default getUsersForSidebar;