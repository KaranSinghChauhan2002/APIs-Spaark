import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/usermodel.js';

export const logincontroller = async (req, res) => {
    const { email, password } = req.body;

    //check if email and pass is empty
    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    //verify JWT sent by auth headers
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    //after 2 validation is complete 

    try {
        //check the jwt sented by frontend via auth headers is correct or expired
        const verify = jwt.verify(token, process.env.JWT_SECRET)



        //after verification
        const lowercasedEmail = email.toLowerCase();
        const finduser = await User.findOne({ email });
        if (!finduser) {
            //not able to find
            return res.status(400).json({ message: 'Invalid credentials email' });
        }

        //compare password 

        const verifypass = await bcrypt.compare(password, finduser.password)
        if (!verifypass) {
            return res.status(400).json({ message: 'Invalid credentials password' });
        }




        //after sucessfully checking the jwt and password 

        res.status(200).json({ message: "LoggedIn Sucessfull", userId: finduser._id })
    } catch (error) {
        res.status(200).json({ message: "Internal Server Error (Login)" })
    console.log(error)
        
    }
}