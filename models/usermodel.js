import mongoose from "mongoose";
const schema = mongoose.Schema({
    email: { type: String, required: true, lowercase: true },
    password: { type: String, required: true }
});
const User=mongoose.model("User",schema);
export default User;