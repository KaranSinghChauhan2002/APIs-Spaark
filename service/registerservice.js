import User from '../models/usermodel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


export const registercontroller = async (req, res) => {
    const { email, password, cnfpassword } = req.body;

    //empty
    if (!email || !password || !cnfpassword) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

    //pass and cnf doesnt match
    if (password !== cnfpassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    //everythingsOK
    try {
        //finduser
        const finduser = await User.findOne({ email })
        if (finduser) {//iftrue(we get user in DB)
            return res.status(400).json({ message: "User Already Exists with this email id" });
        };
        //else do this
        //hashing password for new user 
        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(password, salt);

        //saving it in DB
        const newUser = new User({//object created ssame as usermodel
            email: email,
            password: hashpassword
        })
        //saved in DB
        await newUser.save()

        //jwttoken 
        const token=jwt.sign({newUser},process.env.JWT_SECRET,{expiresIn:'15d'})

        return res.status(201).json({
            email:email,
            jwttoken:token
        })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error (Register)' });
    }



}