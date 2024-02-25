import mongoose from "mongoose";

const connectToMongoDB = async (MONGO_DB_URI) => {
	try {
		
		await mongoose.connect(MONGO_DB_URI);
		console.log("Connected to MongoDB");
	} catch (error) {
		console.log("Error connecting to MongoDB", error.message);
	}
};

export default connectToMongoDB;
