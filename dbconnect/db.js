import mongoose from "mongoose";

function MongoDB(){mongoose.connect(process.env.MONGO_DB)
    console.log("Connected mongoose");
}
export default MongoDB;