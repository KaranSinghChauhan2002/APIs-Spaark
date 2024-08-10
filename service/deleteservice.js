import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/usermodel.js';



export const deletecontroller = async (req, res) => {
    const { email, password } = req.body;

    // Get JWT token from headers
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //verify password sent and password setted in DB
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const passwordverify = await bcrypt.compare(password, user.password)

        if (!passwordverify) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const data = {
            Message: "User deleted",
            Email: email,
            Password: password,
            jwttoken: token
        }
        const deleteUser = await User.deleteOne({ email })

        console.log(`User Deleted ${deleteUser}`)
        //response to user after deleted
        console.log(data)
        return res.json(data)




    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Server error (Deleted )' });
    }
}