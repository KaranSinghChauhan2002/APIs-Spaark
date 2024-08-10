import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/usermodel.js';

export const updatecontroller = async (req, res) => {
    const { email, password, updateemail, updatepass } = req.body;

    // Check if at least one field is provided
    if (!updateemail && !updatepass) {
        return res.status(400).json({ message: 'Please provide at least one field to update' });
    }

    // Get JWT token from headers
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if email and/or password is provided
        if (updateemail) {
            if (!email) {
                return res.status(400).json({ message: 'Email is required to update email' });
            }

            // Update email
            const updateResult = await User.updateOne({ email }, { $set: { email: updateemail } });
            if (updateResult.matchedCount === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'Email updated successfully' });
        }

        if (updatepass) {
            if (!password) {
                return res.status(400).json({ message: 'Current password is required to update password' });
            }

            // Verify current password
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashpassword = await bcrypt.hash(updatepass, salt);

            // Update password
            await User.updateOne({ email }, { $set: { password: hashpassword } });
            res.json({ message: 'Password updated successfully' });
        }
    } catch (error) {
        console.error(error.message);
       return res.status(500).json({ message: 'Server error (Updated)' });
    }
};
