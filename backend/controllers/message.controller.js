import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

/**
 * Send message to a user
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
export const sendMessage = async (req,res) => {
    // console.log("Message sent",req.params.id)
    try {
        const {message}= req.body;      // We are taking message from the user as input
        const{id: receiverId} = req.params;     // We are taking receiverId from the url as input
        const senderId = req.user._id;      // We are taking senderId from the cookies as input

        let conversation = await Conversation.findOne({
            partipants: { $all: [senderId, receiverId],     // Find conversation
            }
        });
        if(!conversation) {            
            conversation = await Conversation.create({      // Create new conversation
                partipants: [senderId, receiverId]
            });
        }

        const newMessage = new Message({        // Create new message
            sender: senderId,
            receiver: receiverId,
            message: message
        });
        if(newMessage){
            conversation.messages.push(newMessage._id);     // Add new message to the conversation
        }

        //Socket Functionality Here

        // await conversation.save();
        // await newMessage.save();
        await Promise.all([conversation.save(), newMessage.save()]); // Save conversation and message asynchronously (at the same time)
        
        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller.", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
};