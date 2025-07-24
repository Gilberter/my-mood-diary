import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt, { SignOptions } from 'jsonwebtoken';


dotenv.config();

// TypeScript interface for User document
export interface IUser extends Document {
    _id: string;
    username: string;
    email: string;
    password: string
    comparePassword: (candidatePassword: string) => Promise<boolean>;
    generateJWT: () => string;
}

// Schema definition
const UserSchema: Schema<IUser> = new Schema<IUser>({
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false // Don't return password on queries by default
    }
}, {
    timestamps: true // Automatically includes createdAt and updatedAt
});

// Hash password before saving
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) { //If the password hasnt been modified
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT
UserSchema.methods.generateJWT = function (): string {
    const payload = {
        id: this._id,
        email: this.email,
        username: this.username
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET not defined in environment variables');
    }

    const options: SignOptions = {
        expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)
    };

    return jwt.sign(payload, secret, options);
};

// Create and export User model
const User = mongoose.model<IUser>('User', UserSchema);

export default User;
