import mongoose from 'mongoose';
import timestampPlugin from '../plugins/timestamp.js';

// Define constants for user status and user type
export const USER_STATUS = {
    ACTIVE: 'active',
    DEACTIVE: 'deactive',
    DELETED: 'deleted',
};

export const USER_TYPE = {
    DOCTOR: 'doctor',
    PATIENT: 'patient'
};

// Define the user schema
const userSchema = new mongoose.Schema({
    // First name of the user
    firstName: { 
        type: String, 
        required: true,
        trim: true, // Removes any whitespace from the beginning and end
    },

    // Last name of the user
    lastName: { 
        type: String, 
        required: true,
        trim: true,
    },

    // Mobile number of the user (optional)
    mobile: { 
        type: String,
        required: true,
    },

    // Email of the user
    email: { 
        type: String, 
        required: true,
        unique: true, // Ensures email uniqueness
        trim: true,
        lowercase: true, // Converts email to lowercase before saving
        validate: {
            validator: function(v) {
                // Email validation logic (example)
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v); // Validates email format
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },

    // Password of the user
    password: { 
        type: String, 
        required: true,
        minlength: 6, // Password must be at least 6 characters long
        trim: true,
        // You may want to add additional validation for password complexity
    },

    // User type of the user
    userType: { 
        type: String, 
        required: true,
        enum: Object.values(USER_TYPE) // Ensures userType is one of the defined constants
    },

    // Status of the user
    status: { 
        type: String,
        enum: Object.values(USER_STATUS), // Ensures status is one of the defined constants
        default: USER_STATUS.ACTIVE
    }

});

// Apply timestamp plugin for createdAt and updatedAt fields
userSchema.plugin(timestampPlugin);

// Create and export the 'user' model based on the schema
const User = mongoose.model('User', userSchema);

export default User;
