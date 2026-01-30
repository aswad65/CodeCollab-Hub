import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
         
    },
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Static method to hash password
userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
};

// Instance method to compare password
userSchema.methods.comparePassword  = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Instance method to generate JWT
userSchema.methods.generateToken = function() {
    return jwt.sign({  email: this.email }, process.env.Jwt_secret , {
        expiresIn: '24h'
    });
};

const User = mongoose.model('User', userSchema);

export default User;