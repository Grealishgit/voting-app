const VoterModel = require('../models/voterModel');
const HttpError = require('../models/ErrorModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registering new voter
const registerVoter = async (req, res, next) => {
    try {
        const { fullName, email, password, password2 } = req.body;

        // Check if all required fields are provided
        if (!fullName || !email || !password || !password2) {
            return next(new HttpError("All fields are required.", 422));
        }

        // Convert email to lowercase
        const newEmail = email.toLowerCase();

        // Check if the email already exists
        const emailExists = await VoterModel.findOne({ email: newEmail });
        if (emailExists) {
            return next(new HttpError("Email already exists.", 422));
        }

        // Validate password length
        if (password.trim().length < 6) {
            return next(new HttpError("Password should be at least 6 characters.", 422));
        }

        // Check if password and confirm password match
        if (password.trim() !== password2.trim()) {
            return next(new HttpError("Passwords do not match.", 422));
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Determine admin status
        const isAdmin = ["systemadmin@gmail.com", "systemadmin2@gmail.com"].includes(newEmail);

        // Create a new voter
        const newVoter = new VoterModel({
            fullName,
            email: newEmail,
            password: hashedPassword,
            isAdmin,
        });

        // Save the voter to the database
        await newVoter.save();

        // Send success response
        return res.status(201).json({ message: `New voter ${fullName} created successfully.` });
    } catch (error) {
        console.error("Error during voter registration:", error.message, error.stack);
        return next(new HttpError("Unable to register a voter. Please try again later.", 500));
    }
};



// Function to generate token
const generateToken = (payload) => {
    try {
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
        return token;
    } catch (error) {
        throw new Error("Token generation failed");
    }
};

// Voter login
const loginVoter = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new HttpError("Email and password are required.", 422));
        }

        const newEmail = email.toLowerCase();
        const voter = await VoterModel.findOne({ email: newEmail });
        if (!voter) {
            return next(new HttpError("Invalid email or password.", 401));
        }

        // Compare passwords
        const comparePassword = await bcrypt.compare(password, voter.password);
        if (!comparePassword) {
            return next(new HttpError("Invalid email or password.", 401));
        }

        const { _id: id, isAdmin, votedElections } = voter;
        const token = generateToken({ id, isAdmin });
        res.json({ token, id, votedElections, isAdmin });
    } catch (error) {
        return next(new HttpError("Login failed. Please check your credentials and try again", 422));
    }
};

// Get voter details
const getVoter = async (req, res, next) => {
    try {
        const { id } = req.params;
        const voter = await VoterModel.findById(id).select("-password");
        if (!voter) {
            return next(new HttpError("Voter not found.", 404));
        }
        res.json(voter);
    } catch (error) {
        return next(new HttpError("Couldn't find the voter.", 404));
    }
};

module.exports = { registerVoter, loginVoter, getVoter };
